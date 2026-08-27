import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaLock, FaUserShield, FaSpinner } from 'react-icons/fa';
import { authAPI } from '../lib/api';
import { useRouter } from 'next/router';

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const SecretAdminAccess = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'stateAdmin' | 'stateAdminLogin' | 'superAdmin'>('stateAdmin');
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    state: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStateAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // roleId 5 is State Admin
      await authAPI.register({
        email: formData.email,
        password: formData.password,
        state: formData.state,
        firstname: formData.firstName,
        lastname: formData.lastName,
        middleName: "",
        roleId: 5,
      });
      setSuccess('Application submitted successfully. Waiting for Super Admin approval.');
      setFormData({ firstName: '', lastName: '', email: '', password: '', state: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSuperAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (response.roleName.toLowerCase() !== 'super admin') {
        setError('Unauthorized role');
        setLoading(false);
        return;
      }

      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      
      setIsOpen(false);
      router.push('/superadmin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStateAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (response.roleName.toLowerCase() !== 'state admin') {
        setError('Unauthorized role');
        setLoading(false);
        return;
      }

      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      
      setIsOpen(false);
      router.push('/state-admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Note: Your application may still be pending.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-[#1A1A1A] w-full min-h-screen sm:min-h-[auto] sm:w-[80vw] sm:max-w-4xl sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col"
        >
          <div className="flex justify-between items-center p-8 border-b border-gray-800">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaLock className="text-yellow-500" /> Secure Portal
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <FaTimes size={24} />
            </button>
          </div>

          <div className="flex border-b border-gray-800 overflow-x-auto">
            <button
              onClick={() => { setActiveTab('stateAdmin'); setError(''); setSuccess(''); }}
              className={`flex-1 min-w-[200px] py-4 text-base font-medium transition-colors ${activeTab === 'stateAdmin' ? 'bg-[#2A2A2A] text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400 hover:text-gray-200'}`}
            >
              State Admin (Apply)
            </button>
            <button
              onClick={() => { setActiveTab('stateAdminLogin'); setError(''); setSuccess(''); }}
              className={`flex-1 min-w-[200px] py-4 text-base font-medium transition-colors ${activeTab === 'stateAdminLogin' ? 'bg-[#2A2A2A] text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400 hover:text-gray-200'}`}
            >
              State Admin (Login)
            </button>
            <button
              onClick={() => { setActiveTab('superAdmin'); setError(''); setSuccess(''); }}
              className={`flex-1 min-w-[200px] py-4 text-base font-medium transition-colors ${activeTab === 'superAdmin' ? 'bg-[#2A2A2A] text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Super Admin (Login)
            </button>
          </div>

          <div className="p-8 overflow-y-auto max-h-[70vh]">
            {error && <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-900/50 border border-green-500/50 rounded text-green-200 text-sm">{success}</div>}

            {activeTab === 'stateAdmin' ? (
              <form onSubmit={handleStateAdminSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">First Name</label>
                    <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-[#2A2A2A] border border-gray-700 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                    <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-[#2A2A2A] border border-gray-700 rounded p-2 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">State</label>
                  <select required name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-[#2A2A2A] border border-gray-700 rounded p-2 text-white">
                    <option value="">Select State</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input type="email" required name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#2A2A2A] border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Password</label>
                  <input type="password" required name="password" value={formData.password} onChange={handleInputChange} className="w-full bg-[#2A2A2A] border border-gray-700 rounded p-2 text-white" />
                </div>
                <button disabled={loading} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-4 transition-colors flex items-center justify-center">
                  {loading ? <FaSpinner className="animate-spin" /> : 'Submit Application'}
                </button>
              </form>
            ) : activeTab === 'stateAdminLogin' ? (
              <form onSubmit={handleStateAdminLoginSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">State Admin Email</label>
                  <input type="email" required name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#2A2A2A] border border-gray-700 rounded p-3 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Password</label>
                  <input type="password" required name="password" value={formData.password} onChange={handleInputChange} className="w-full bg-[#2A2A2A] border border-gray-700 rounded p-3 text-white" />
                </div>
                <button disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded mt-6 transition-colors flex items-center justify-center gap-2">
                  {loading ? <FaSpinner className="animate-spin" /> : <><FaLock /> Login</>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSuperAdminSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Super Admin Email</label>
                  <input type="email" required name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#2A2A2A] border border-gray-700 rounded p-3 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Master Password</label>
                  <input type="password" required name="password" value={formData.password} onChange={handleInputChange} className="w-full bg-[#2A2A2A] border border-gray-700 rounded p-3 text-white" />
                </div>
                <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mt-6 transition-colors flex items-center justify-center gap-2">
                  {loading ? <FaSpinner className="animate-spin" /> : <><FaUserShield /> Authenticate</>}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SecretAdminAccess;
