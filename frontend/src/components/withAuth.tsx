import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { authAPI } from '../lib/api';

interface DecodedToken {
  userId: string;
  role: string;
  exp: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
}

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P & { userId: string; role: string; user?: User }>,
  roles: string[] = []
) => {
  const WithAuthComponent: React.FC<P> = (props) => {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          // Temporary: Skip auth check
          setUserId('temp-user');
          setRole('Student');
          setUser({
            id: 1,
            name: 'Temporary User',
            email: '123',
            role: { id: 1, name: 'Student' }
          });
          setLoading(false);
          return;
        }

        try {
          const decoded = jwtDecode<DecodedToken>(token);

          if (decoded.exp * 1000 < Date.now()) {
            // Try to refresh token
            try {
              await authAPI.refresh();
              const newToken = localStorage.getItem('token');
              if (newToken) {
                const newDecoded = jwtDecode<DecodedToken>(newToken);
                if (roles.length > 0 && !roles.includes(newDecoded.role)) {
                  router.push('/');
                  return;
                }
                const userData = await authAPI.getMe();
                setUserId(newDecoded.userId);
                setRole(newDecoded.role);
                setUser(userData);
                setLoading(false);
                return;
              }
            } catch (refreshError) {
              localStorage.removeItem('token');
              router.push('/login');
              return;
            }
          }

          if (roles.length > 0 && !roles.includes(decoded.role)) {
            router.push('/');
            return;
          }

          // Get user data from API
          try {
            const userData = await authAPI.getMe();
            setUserId(decoded.userId);
            setRole(decoded.role);
            setUser(userData);
          } catch (error) {
            console.error('Failed to get user data:', error);
            localStorage.removeItem('token');
            router.push('/login');
            return;
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
          localStorage.removeItem('token');
          router.push('/login');
          return;
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (userId && role) {
      return <WrappedComponent {...props} userId={userId} role={role} user={user || undefined} />;
    }
    return null;
  };

  return WithAuthComponent;
};

export default withAuth;
