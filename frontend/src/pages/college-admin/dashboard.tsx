import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaGraduationCap,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaEye,
  FaDownload,
  FaFileAlt,
  FaUniversity,
  FaUserCheck,
  FaUserTimes,
  FaAward,
  FaHandshake,
  FaCheckDouble,
  FaSignOutAlt,
  FaUserClock,
  FaChartBar,
  FaBars // Added import
} from 'react-icons/fa';
import { authAPI, collegeAPI } from '../../lib/api';
import CollegeProfileForm from '../../components/college/CollegeProfileForm';
import AdminStudentRegistration from '../../components/college/AdminStudentRegistration';
import StudentVerificationModal from '../../components/college/StudentVerificationModal';
import axios from 'axios';

const AdminDashboard = () => {
  const router = useRouter();
  const { tab } = router.query;
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'students' | 'register_student' | 'applications' | 'reports' | 'partners' | 'compliance' | 'analytics'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Added state

  useEffect(() => {
    if (tab && typeof tab === 'string') {
      setActiveTab(tab as any);
    }
  }, [tab]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [approvedStudents, setApprovedStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchPendingStudents();
    fetchApprovedStudents();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/college/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (error) {
      console.log('Profile not found or error fetching');
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchPendingStudents = async () => {
    try {
      const data = await collegeAPI.getPendingStudents();
      setPendingStudents(data);
    } catch (error) {
      console.error('Failed to fetch pending students', error);
    }
  };

  const fetchApprovedStudents = async () => {
    try {
      const data = await collegeAPI.getApprovedStudents();
      setApprovedStudents(data);
    } catch (error) {
      console.error('Failed to fetch approved students', error);
    }
  };

  const handleStudentApproval = async (studentId: number, status: 'Approved' | 'Rejected') => {
    try {
      await collegeAPI.approveStudent(studentId, status);
      // Refresh list
      fetchPendingStudents();
      fetchApprovedStudents();
      alert(`Student ${status} successfully`);
    } catch (error) {
      console.error('Failed to update student status', error);
      alert('Failed to update status');
    }
  };

  const [stats, setStats] = useState({
    totalStudents: 0,
    activeInternships: 0,
    pendingApplications: 0,
    completedInternships: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await collegeAPI.getDashboardStats(); // You need to add this to api.ts if not exists, but we can call axios directly or add it
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    }
    fetchStats();
  }, []);

  // Pending applications list - currently empty until backend endpoint is implemented
  const pendingApplications: any[] = [];

  const Sidebar = () => (
    <div className={`bg-beige border-r border-gray-200 min-h-screen flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
      <div className="p-6 border-b border-gray-200 whitespace-nowrap">
        <h1 className="text-xl font-bold text-gray-800">
          {profile?.collegeName || 'Dashboard'}
        </h1>
        <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 whitespace-nowrap">
        {[
          { id: 'overview', label: 'Overview', icon: FaChartLine },
          { id: 'approvals', label: 'Student Approvals', icon: FaUserClock },
          { id: 'students', label: 'Students', icon: FaUsers },
          { id: 'register_student', label: 'Register Student', icon: FaUserCheck },
          { id: 'applications', label: 'Pending Applications', icon: FaFileAlt },
          { id: 'reports', label: 'Reports', icon: FaDownload },
          { id: 'partners', label: 'Industry Partners', icon: FaHandshake },
          { id: 'compliance', label: 'NEP Compliance', icon: FaCheckDouble },
          { id: 'analytics', label: 'Analytics', icon: FaChartBar },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setIsSidebarOpen(false); // Close sidebar on click
            }}
            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
              ? 'bg-green-50 text-green-700 border-r-4 border-green-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <tab.icon className={`text-lg ${activeTab === tab.id ? 'text-green-600' : 'text-gray-400'}`} />
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 whitespace-nowrap">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-beige overflow-hidden">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 z-50 transition-all duration-300 p-2 rounded-md ${isSidebarOpen ? 'left-52 text-gray-600' : 'left-4 bg-white shadow-md text-gray-600'}`}
      >
        <FaBars className="text-xl" />
      </button>

      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 pl-16">
          <div className="flex items-center gap-4">
            {/* Info: Button moved to outside */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              {activeTab === 'overview' && (
                <p className="text-sm text-gray-500">
                  {profile?.adminName ? `Welcome back, ${profile.adminName}` : 'Manage your college activities'}
                </p>
              )}
            </div>
          </div>


          {/* Mini Profile / Stats Summary in Header */}
          <div className="flex items-center gap-4">
            {activeTab !== 'overview' && (
              <button
                onClick={() => setActiveTab('overview')}
                className="btn-secondary text-xs mr-2"
              >
                Back to Dashboard
              </button>
            )}
            <div className="text-right hidden md:block">
              <p className="text-xs text-gray-500">Total Students</p>
              <p className="font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold border border-green-200">
              {profile?.adminName ? profile.adminName[0] : 'A'}
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">

            {/* Overview Tab Content (Now includes Stats & Profile) */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards - MOVED HERE */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Students', value: stats.totalStudents, icon: FaUsers, color: 'blue' },
                    { label: 'Active Internships', value: stats.activeInternships, icon: FaClock, color: 'yellow' },
                    { label: 'Pending Applications', value: stats.pendingApplications, icon: FaFileAlt, color: 'orange' },
                    { label: 'Completed', value: stats.completedInternships, icon: FaCheckCircle, color: 'green' },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="card"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                          <stat.icon className={`text-2xl text-${stat.color}-600`} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Profile Widget */}
                {!profileLoading && (
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                        <FaUniversity className="text-2xl text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{profile?.collegeName || 'My College'}</h3>
                        <p className="text-gray-500">{profile?.city}, {profile?.state}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowProfileForm(true)} className="btn-secondary">
                      Edit Profile
                    </button>
                  </div>
                )}
                {/* Incomplete Profile Warning */}
                {(!profileLoading && !profile) && (
                  <div className="bg-red-50 p-6 rounded-lg border border-red-200 flex justify-between items-center">
                    <div className="text-red-700">
                      <h4 className="font-bold">Profile Incomplete</h4>
                      <p className="text-sm">Please update your college profile to verify your account.</p>
                    </div>
                    <button onClick={() => setShowProfileForm(true)} className="btn-primary bg-red-600 hover:bg-red-700 border-transparent">
                      Complete Now
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full btn-primary text-left flex items-center gap-3 justify-center md:justify-start">
                        <FaUserCheck /> Approve Pending Applications
                      </button>
                      <button className="w-full btn-secondary text-left flex items-center gap-3 justify-center md:justify-start">
                        <FaDownload /> Generate College Report
                      </button>
                      <button className="w-full btn-secondary text-left flex items-center gap-3 justify-center md:justify-start">
                        <FaAward /> Verify Certificates
                      </button>
                    </div>
                  </div>
                  <div className="card">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {/* Recent Activity - Placeholder for real data integration */}
                      <div className="text-center py-8 text-gray-500">
                        <p>No recent activity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Approvals Tab */}
            {activeTab === 'approvals' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Student Approvals</h3>
                </div>
                {pendingStudents.length === 0 ? (
                  <div className="card text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FaCheckCircle className="text-2xl text-gray-300" />
                    </div>
                    <p className="text-gray-600 font-medium">No pending approvals</p>
                    <p className="text-gray-400 text-sm">All students are up to date</p>
                  </div>
                ) : (
                  pendingStudents.map((student, idx) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="card"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{student.firstName} {student.lastName}</h3>
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Pending</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
                            <p><strong>Email:</strong> {student.user.email}</p>
                            <p><strong>Roll No:</strong> {student.rollNo || 'N/A'}</p>
                            <p><strong>Course:</strong> {student.course || 'N/A'}</p>
                            <p><strong>Branch:</strong> {student.branch || 'N/A'}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowVerificationModal(true);
                          }}
                          className="btn-primary text-xs bg-blue-600 hover:bg-blue-700"
                        >
                          View Request
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div>
                {/* Search and Filter */}
                <div className="card mb-6 p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search students by name, email, or roll no..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <button className="btn-secondary flex items-center gap-2">
                      <FaFilter /> Filter
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {approvedStudents.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <FaUsers className="mx-auto text-4xl mb-3 text-gray-300" />
                      <p>No students have been approved yet.</p>
                    </div>
                  ) : (
                    approvedStudents
                      .filter(student =>
                        student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        student.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((student, idx) => (
                        <motion.div
                          key={student.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className="card hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                                {student.firstName ? student.firstName[0] : 'S'}
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{student.firstName} {student.lastName}</h3>
                                <p className="text-sm text-gray-600">{student.user.email} • {student.rollNo || 'No Roll No'}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="btn-secondary text-xs">View Profile</button>
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1">
                                <FaCheckCircle /> Verified
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                  )}
                  {/* Show message if filter returns empty */}
                  {approvedStudents.length > 0 && approvedStudents.filter(student =>
                    student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length === 0 && (
                      <div className="text-center py-8 text-gray-500">No students match your search.</div>
                    )}
                </div>
              </div>
            )}


            {/* Register Student Tab */}
            {activeTab === 'register_student' && (
              <AdminStudentRegistration />
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Generate Reports</h3>
                  <div className="space-y-3">
                    {['All Students Report', 'Internship Statistics', 'Credits Summary'].map(label => (
                      <button key={label} className="w-full btn-secondary text-left flex justify-between items-center group">
                        <span>{label}</span>
                        <FaDownload className="text-gray-400 group-hover:text-gray-600" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}


            {/* Partners Tab */}
            {activeTab === 'partners' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Industry Partnerships</h3>
                  <button className="btn-primary flex items-center gap-2 text-sm">
                    <FaHandshake /> Add Partner
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Tech Corp', type: 'IT Services', interns: 12, status: 'Active', expiry: '2025-12-31' },
                    { name: 'Green Energy Ltd', type: 'Renewable Energy', interns: 5, status: 'Active', expiry: '2025-06-30' },
                    { name: 'City Hospital', type: 'Healthcare', interns: 8, status: 'Pending Renewal', expiry: '2024-12-31' },
                  ].map((partner, idx) => (
                    <div key={idx} className="card border-l-4 border-green-500">
                      <h4 className="font-bold text-gray-900">{partner.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{partner.type}</p>
                      <div className="flex justify-between items-center text-sm mb-3">
                        <span className="text-gray-600">{partner.interns} Interns</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${partner.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{partner.status}</span>
                      </div>
                      <button className="w-full btn-secondary text-xs">View Details</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compliance Tab */}
            {activeTab === 'compliance' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
                  <h3 className="text-2xl font-bold mb-1">NEP 2020 Compliance</h3>
                  <p className="opacity-90">Overall Score: 85% - Good Standing</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Internship Credits', status: 'Compliant', desc: 'All internships are credit-based.' },
                    { label: 'Faculty Mentorship', status: 'Partial', desc: '80% students have assigned mentors.' },
                    { label: 'Digital Logbooks', status: 'Compliant', desc: '100% adoption of digital logs.' },
                  ].map((item, idx) => (
                    <div key={idx} className="card">
                      <div className="flex items-center gap-2 mb-2">
                        <FaCheckDouble className={item.status === 'Compliant' ? 'text-green-600' : 'text-yellow-600'} />
                        <h4 className="font-bold text-gray-900">{item.label}</h4>
                      </div>
                      <p className={`text-sm font-bold mb-2 ${item.status === 'Compliant' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {item.status}
                      </p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Internship Placements by Sector</h3>
                    <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                      [Pie Chart Placeholder: IT 40%, Core Eng 30%, Management 20%, Others 10%]
                    </div>
                  </div>
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Skill Gap Analysis</h3>
                    <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                      [Bar Chart Placeholder: Communication (High Gap), Technical (Medium Gap)]
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div >

      {/* Modals */}
      {showProfileForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-10">
          <div className="relative w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
            <button
              onClick={() => setShowProfileForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              Close
            </button>
            <CollegeProfileForm
              onSkip={() => setShowProfileForm(false)}
              onSuccess={() => {
                fetchProfile();
                setShowProfileForm(false);
              }}
            />
          </div>
        </div>
      )}

      <StudentVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        student={selectedStudent}
        onSuccess={() => {
          fetchPendingStudents();
          fetchApprovedStudents();
        }}
      />
    </div >
  );
};

export default AdminDashboard;
