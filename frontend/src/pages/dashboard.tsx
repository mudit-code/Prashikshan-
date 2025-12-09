import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../components/withAuth';

const Dashboard = ({ user }: any) => {
    const router = useRouter();

    useEffect(() => {
        if (user?.role?.name) {
            const role = user.role.name.toLowerCase();

            switch (role) {
                case 'student':
                    router.replace('/student/dashboard');
                    break;
                case 'employer':
                    router.replace('/employer/dashboard');
                case 'employer':
                    router.replace('/employer/dashboard');
                    break;
                case 'admin':
                    router.replace('/college-admin/dashboard');
                    break;
                case 'state admin':
                    router.replace('/state-admin/dashboard');
                    break;
                default:
                    console.error('Unknown role:', user.role.name);
                    break;
            }
        }
    }, [user]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
};

export default withAuth(Dashboard);
