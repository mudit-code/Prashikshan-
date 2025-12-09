import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaUser, FaSignOutAlt, FaBuilding, FaUniversity } from 'react-icons/fa';
import withAuth from '../../components/withAuth';
import { authAPI } from '../../lib/api';

const StateAdminDashboard = ({ user }: any) => {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);
            await authAPI.logout();
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            router.push('/login-selection');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>State Admin Dashboard | Prashikshan</title>
            </Head>

            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-10 transition-transform duration-300 transform translate-x-0">
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                                <FaUniversity className="text-xl" />
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                                Prashikshan
                            </h1>
                        </div>
                        <p className="mt-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            State Administration
                        </p>
                    </div>

                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <div className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium flex items-center gap-3">
                            <FaBuilding />
                            <span>Dashboard</span>
                        </div>
                        {/* Add more nav items here later */}
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg mb-3">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm">
                                <FaUser className="text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.profile?.first_name} {user?.profile?.last_name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.profile?.state}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <FaSignOutAlt />
                            {loading ? 'Logging out...' : 'Sign Out'}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-600">Welcome back, {user?.profile?.first_name}!</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">State Profile</h3>
                        <p className="text-gray-600">State: <span className="font-medium text-gray-900">{user?.profile?.state}</span></p>
                    </div>
                    {/* Add more cards here */}
                </div>
            </main>
        </div>
    );
};

export default withAuth(StateAdminDashboard);
