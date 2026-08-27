import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserShield, FaCheck, FaTimes, FaSpinner, FaUsers, FaBuilding, FaUniversity, FaChartLine, FaMapMarkedAlt, FaSignOutAlt } from 'react-icons/fa';
import withAuth from '../../components/withAuth';
import { api } from '../../lib/api';

const SuperAdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'stateAdmins' | 'students' | 'employers' | 'colleges'>('overview');
  
  const [stats, setStats] = useState({ students: 0, employers: 0, colleges: 0, stateAdmins: 0 });
  const [stateAdmins, setStateAdmins] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [employers, setEmployers] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, stateAdminsRes, studentsRes, employersRes, collegesRes] = await Promise.all([
        api.get('/api/superadmin/stats'),
        api.get('/api/superadmin/state-admins'),
        api.get('/api/superadmin/students'),
        api.get('/api/superadmin/employers'),
        api.get('/api/superadmin/colleges')
      ]);

      setStats(statsRes.data);
      setStateAdmins(stateAdminsRes.data);
      setStudents(studentsRes.data);
      setEmployers(employersRes.data);
      setColleges(collegesRes.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/api/superadmin/state-admins/${id}/status`, { status });
      setStateAdmins(prev => prev.map(admin => admin.id === id ? { ...admin, status } : admin));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="animate-spin text-5xl text-blue-500" />
          <p className="text-gray-400">Loading System Data...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
    { id: 'stateAdmins', label: 'State Admins', icon: <FaMapMarkedAlt /> },
    { id: 'students', label: 'Students', icon: <FaUsers /> },
    { id: 'employers', label: 'Employers', icon: <FaBuilding /> },
    { id: 'colleges', label: 'Colleges', icon: <FaUniversity /> },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Top Navbar */}
      <div className="bg-[#111] border-b border-gray-800 sticky top-0 z-10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <FaUserShield className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                Command Center
              </h1>
              <p className="text-sm text-gray-400">Super Admin Privileges</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-medium"
          >
            <FaSignOutAlt /> Logout
          </button>
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
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Students', value: stats.students, icon: <FaUsers />, color: 'from-blue-600 to-cyan-600' },
                  { label: 'Total Employers', value: stats.employers, icon: <FaBuilding />, color: 'from-purple-600 to-pink-600' },
                  { label: 'Total Colleges', value: stats.colleges, icon: <FaUniversity />, color: 'from-orange-600 to-red-600' },
                  { label: 'State Admins', value: stats.stateAdmins, icon: <FaMapMarkedAlt />, color: 'from-green-600 to-emerald-600' },
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

            {activeTab === 'stateAdmins' && (
              <div className="bg-[#111] rounded-3xl border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                  <h2 className="text-xl font-bold text-white">State Admin Applications</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#1A1A1A]">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Name</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Email</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">State</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Date Applied</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {stateAdmins.map((admin) => (
                        <tr key={admin.id} className="hover:bg-[#1A1A1A] transition-colors">
                          <td className="px-6 py-4 text-white font-medium">{admin.first_name} {admin.last_name}</td>
                          <td className="px-6 py-4 text-gray-400">{admin.email}</td>
                          <td className="px-6 py-4 text-gray-300 font-medium">{admin.state}</td>
                          <td className="px-6 py-4 text-gray-500">{new Date(admin.create_time).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                              ${admin.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''}
                              ${admin.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
                              ${admin.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : ''}
                            `}>
                              {admin.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {admin.status === 'pending' && (
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleUpdateStatus(admin.id, 'approved')} className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-colors">
                                  <FaCheck />
                                </button>
                                <button onClick={() => handleUpdateStatus(admin.id, 'rejected')} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                                  <FaTimes />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="bg-[#111] rounded-3xl border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                  <h2 className="text-xl font-bold text-white">Registered Students</h2>
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
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'employers' && (
              <div className="bg-[#111] rounded-3xl border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                  <h2 className="text-xl font-bold text-white">Registered Employers</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#1A1A1A]">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Contact Name</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Company Name</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Email</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {employers.map((user) => (
                        <tr key={user.id} className="hover:bg-[#1A1A1A] transition-colors">
                          <td className="px-6 py-4 text-white font-medium">{user.first_name} {user.last_name}</td>
                          <td className="px-6 py-4 text-gray-300 font-medium">{user.company_name || 'N/A'}</td>
                          <td className="px-6 py-4 text-gray-400">{user.email}</td>
                          <td className="px-6 py-4 text-gray-500">{new Date(user.create_time).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'colleges' && (
              <div className="bg-[#111] rounded-3xl border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                  <h2 className="text-xl font-bold text-white">Registered Colleges</h2>
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

export default withAuth(SuperAdminDashboard, ['Super Admin']);
