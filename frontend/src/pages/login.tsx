import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaRocket, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { authAPI } from '../lib/api';

const LoginPage = () => {
  const router = useRouter();
  const { role: roleParam } = router.query;
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'Student' | 'College Admin' | 'Employer' | 'State Admin'>('Student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Effect to set role from query param
  React.useEffect(() => {
    if (router.isReady) {
      if (!roleParam) {
        router.replace('/login-selection');
        return;
      }

      const roleStr = roleParam as string;
      const validRoles = ['Student', 'College Admin', 'Employer', 'State Admin'];

      if (validRoles.includes(roleStr)) {
        setRole(roleStr as any);
      } else {
        router.replace('/login-selection');
      }
    }
  }, [router.isReady, roleParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Temporary hardcoded login
      if (formData.email === '123@ab' && formData.password === 'pass') {
        // Simulate successful login
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
        return;
      }

      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });
      console.log('the response is:', response)

      const backendRole = response.roleName.toLowerCase();

      // Map frontend role names to backend role names
      const roleMap: any = {
        Student: "student",
        "College Admin": "admin",
        Employer: "employer",
        "State Admin": "state admin",
      };

      // Compare
      if (roleMap[role] !== backendRole) {
        setError(`Please login as ${role}`);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      // Redirect to unified dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#4A3728] rounded-full mb-4">
            <FaRocket className="text-4xl text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">
            Signing in as <span className="font-bold text-[#4A3728]">{role}</span>
          </p>
          <button
            onClick={() => router.push('/login-selection')}
            className="text-sm text-gray-500 hover:text-[#4A3728] mt-2 inline-flex items-center"
          >
            <FaArrowLeft className="mr-1" /> Change Role
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card"
        >
          {/* Role Selection - HIDDEN */}
          <div className="hidden">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Login As
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'Student', label: 'Student' },
                { value: 'College Admin', label: 'College Admin' },
                { value: 'Employer', label: 'Employer' },
                { value: 'State Admin', label: 'State Admin' },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value as any)}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${role === r.value
                    ? 'bg-[#4A3728] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-[#4A3728] focus:ring-[#4A3728]" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="#" className="text-sm text-[#4A3728] hover:text-[#3E2723] font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary bg-[#4A3728] hover:bg-[#3E2723] py-3 text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to Prashikshan?</span>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <Link
              href="/select-role"
              className="text-[#4A3728] hover:text-[#3E2723] font-semibold"
            >
              Create an account →
            </Link>
          </div>
        </motion.div>

        {/* Helpdesk Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-center"
        >
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-800">
            Need help? Contact Helpdesk
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
