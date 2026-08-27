import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserShield, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import withAuth from '../../components/withAuth';
import api from '../../lib/api';

const SuperAdminDashboard = () => {
  const [stateAdmins, setStateAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStateAdmins();
  }, []);

  const fetchStateAdmins = async () => {
    try {
      const response = await api.get('/superadmin/state-admins');
      setStateAdmins(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch state admins');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/superadmin/state-admins/${id}/status`, { status });
      // Update local state
      setStateAdmins(prev => prev.map(admin => admin.id === id ? { ...admin, status } : admin));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-[#4A3728]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-4">
            <FaUserShield className="text-[#4A3728]" /> Super Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Manage platform-wide settings and State Admins.</p>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">State Admin Applications</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">State</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Date Applied</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stateAdmins.map((admin, index) => (
                  <motion.tr 
                    key={admin.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{admin.first_name} {admin.last_name}</td>
                    <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{admin.state}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(admin.create_time).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${admin.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                        ${admin.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                        ${admin.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                      `}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {admin.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStatus(admin.id, 'approved')}
                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-lg transition-colors title='Approve'"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(admin.id, 'rejected')}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors title='Reject'"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
                {stateAdmins.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No State Admin applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(SuperAdminDashboard, ['Super Admin']);
