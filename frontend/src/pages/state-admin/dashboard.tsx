import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserShield, FaSignOutAlt, FaSpinner, FaUsers, FaUniversity, FaChartLine, FaMapMarkedAlt } from 'react-icons/fa';
import withAuth from '../../components/withAuth';
import { api, authAPI } from '../../lib/api';

const StateAdminDashboard = ({ user }: any) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'colleges' | 'students'>('overview');
  
  const [stats, setStats] = useState({ students: 0, colleges: 0, activeInternships: 0 });
  const [students, setStudents] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, studentsRes, collegesRes] = await Promise.all([
        api.get('/api/stateadmin/stats'),
        api.get('/api/stateadmin/students'),
        api.get('/api/stateadmin/colleges')
      ]);

      setStats(statsRes.data);
      setStudents(studentsRes.data);
      setColleges(collegesRes.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
        setLogoutLoading(true);
        await authAPI.logout();
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem('role');
        router.push('/login-selection');
    } catch (err) {
        console.error("Logout failed", err);
    } finally {
        setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="animate-spin text-5xl text-emerald-500" />
          <p className="text-gray-400">Loading State Data...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
    { id: 'colleges', label: 'Colleges Directory', icon: <FaUniversity /> },
    { id: 'students', label: 'Students Directory', icon: <FaUsers /> },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Head>
        <title>State Admin Dashboard | Prashikshan</title>
      </Head>

      {/* Top Navbar */}
      <div className="bg-[#111] border-b border-gray-800 sticky top-0 z-10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <FaMapMarkedAlt className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                State Administration
              </h1>
              <p className="text-sm text-gray-400">{user?.profile?.state} Jurisdiction</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">{user?.profile?.first_name} {user?.profile?.last_name}</p>
                <p className="text-xs text-gray-500">State Admin</p>
            </div>
            <button 
                onClick={handleLogout}
                disabled={logoutLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-medium disabled:opacity-50"
            >
                {logoutLoading ? <FaSpinner className="animate-spin" /> : <FaSignOutAlt />} Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-xl">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 p-2 bg-[#111] rounded-2xl border border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#222]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Total Colleges', value: stats.colleges, icon: <FaUniversity />, color: 'from-emerald-600 to-teal-600' },
                  { label: 'Total Students', value: stats.students, icon: <FaUsers />, color: 'from-blue-600 to-cyan-600' },
                  { label: 'Active Internships', value: stats.activeInternships, icon: <FaChartLine />, color: 'from-purple-600 to-pink-600' },
                ].map((stat, idx) => (
                  <div key={idx} className="relative overflow-hidden bg-[#111] rounded-3xl border border-gray-800 p-8 group hover:border-gray-700 transition-colors">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <p className="text-gray-400 font-medium mb-2">{stat.label}</p>
                        <h3 className="text-4xl font-bold text-white">{stat.value?.toLocaleString() || 0}</h3>
                      </div>
                      <div className="p-4 bg-[#222] rounded-2xl text-2xl text-gray-300">
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'colleges' && (
              <div className="bg-[#111] rounded-3xl border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Registered Colleges</h2>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold uppercase">
                    {colleges.length} Colleges
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#1A1A1A]">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">ID</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">College Name</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Branch</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {colleges.map((college) => (
                        <tr key={college.id} className="hover:bg-[#1A1A1A] transition-colors">
                          <td className="px-6 py-4 text-gray-500">#{college.id}</td>
                          <td className="px-6 py-4 text-white font-medium">{college.college_name}</td>
                          <td className="px-6 py-4 text-gray-400">{college.branch || 'N/A'}</td>
                          <td className="px-6 py-4 text-gray-400">{college.location || 'N/A'}</td>
                        </tr>
                      ))}
                      {colleges.length === 0 && (
                          <tr>
                              <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No colleges found.</td>
                          </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="bg-[#111] rounded-3xl border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Registered Students</h2>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold uppercase">
                    {students.length} Students
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#1A1A1A]">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Name</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Email</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">College</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {students.map((user) => (
                        <tr key={user.id} className="hover:bg-[#1A1A1A] transition-colors">
                          <td className="px-6 py-4 text-white font-medium">{user.first_name} {user.last_name}</td>
                          <td className="px-6 py-4 text-gray-400">{user.email}</td>
                          <td className="px-6 py-4 text-gray-300">{user.college_name || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              {user.status || 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500">{new Date(user.create_time).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {students.length === 0 && (
                          <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No students found.</td>
                          </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default withAuth(StateAdminDashboard, ['State Admin']);
