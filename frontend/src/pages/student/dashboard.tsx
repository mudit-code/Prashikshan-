import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  FaBriefcase,
  FaFileAlt,
  FaCertificate,
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaEye,
  FaDownload,
  FaBook,
  FaGraduationCap,
  FaAward,
  FaSpinner,
  FaBookReader,
  FaChalkboardTeacher,
  FaVideo,
  FaCalendarAlt,

  FaSignOutAlt,
  FaUser,
  FaUserTimes,
  FaBuilding,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBars, // Added for Sidebar
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { internshipsAPI, applicationsAPI, logbooksAPI, authAPI, studentAPI } from '../../lib/api';
import withAuth from '../../components/withAuth';
import ProfileForm from '../../components/student/ProfileForm';
import ResumeView from '../../components/student/ResumeView';
import CollegeVerificationForm from '../../components/student/CollegeVerificationForm';
import axios from 'axios';

interface StudentDashboardProps {
  userId: string;
  role: string;
  user?: {
    id: number;
    name: string;
    email: string;
    collegeId?: number;
    role: {
      id: number;
      name: string;
    };
  };
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ userId, role, user }) => {
  const router = useRouter();
  const { tab } = router.query;
  const [activeTab, setActiveTab] = useState<'opportunities' | 'internships' | 'applications' | 'certificates' | 'logbook' | 'skills' | 'mentorship'>('opportunities');

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

  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [logbooks, setLogbooks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showResumeView, setShowResumeView] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [applicationSummary, setApplicationSummary] = useState<any>(null);

  // Logbook State
  const [newLogEntry, setNewLogEntry] = useState('');
  const [newLogStatus, setNewLogStatus] = useState('In Progress');
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editStatus, setEditStatus] = useState('In Progress');

  const LOG_STATUSES = ['In Progress', 'Completed', 'Aborted'];

  const handleApply = async (internshipId: number) => {
    if (!resumeFile) {
      alert('Please upload your resume first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('internshipId', internshipId.toString());
      formData.append('resume', resumeFile);

      await applicationsAPI.create(internshipId);
      alert('Application submitted successfully!');
      setApplyingId(null);
      setResumeFile(null);
      fetchData();
    } catch (error: any) {
      console.error('Application error:', error);
      alert(error.response?.data?.error || 'Failed to apply');
    }
  };


  const [internships, setInternships] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const studentId = userId || user?.id?.toString();

      if (activeTab === 'opportunities') {
        // Fetch eligible jobs for the student
        if (studentId) {
          const data = await studentAPI.getEligibleJobs(studentId);
          setOpportunities(data.jobs || []);
        } else {
          const data = await internshipsAPI.getAll();
          setOpportunities(data);
        }
      } else if (activeTab === 'internships') {
        const data = await internshipsAPI.getAll();
        setInternships(data);
      } else if (activeTab === 'applications') {
        // Fetch application details for the student
        if (studentId) {
          const data = await studentAPI.getApplicationDetails(studentId);
          setApplications(data.applications || []);
        } else {
          const data = await applicationsAPI.getMyApplications();
          setApplications(data);
        }
      } else if (activeTab === 'logbook') {
        const data = await logbooksAPI.getAll();
        setLogbooks(data);
      }

      // Fetch application summary for stats
      if (studentId) {
        const summary = await studentAPI.getApplicationSummary(studentId);
        setApplicationSummary(summary);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // Fetch initial application summary
    const studentId = userId || user?.id?.toString();
    if (studentId) {
      studentAPI.getApplicationSummary(studentId)
        .then(setApplicationSummary)
        .catch(err => console.error('Error fetching application summary:', err));
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const studentId = userId || user?.id?.toString();
      if (!studentId) {
        console.log('No user ID available');
        setProfileLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/profile/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Extract the profile data from the nested response
      // The backend returns { ...rootFields, profile: { ...nestedFields } }
      // We merge them so we can access everything at the top level
      if (res.data && res.data.profile) {
        setProfile({ ...res.data.profile, ...res.data });
      } else {
        setProfile(res.data);
      }
    } catch (error) {
      console.log('Profile not found or error fetching');
    } finally {
      setProfileLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp =>
    opp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.internship_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats from application summary
  const stats = {
    totalApplications: applicationSummary?.total_applications || applications.length,
    activeInternships: applicationSummary?.active_internships || applications.filter(app => app.status === 'Accepted').length,
    completedInternships: applicationSummary?.completed_internships || applications.filter(app => app.status === 'Completed').length,
    totalCredits: 0, // This would need to come from credits API
  };

  // Mock certificates (would need credits API)
  const certificates: any[] = [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Debug Profile
  console.log("Dashboard Render - Profile:", profile);
  if (profile) console.log("Approval Status:", profile.approvalStatus);

  const Sidebar = () => (
    <div className={`bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
      <div className="p-6 border-b border-gray-200 whitespace-nowrap">
        <h1 className="text-xl font-bold text-gray-800">
          Student Panel
        </h1>
        <p className="text-xs text-gray-500 mt-1">Dashboard</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 whitespace-nowrap">
        {[
          { id: 'opportunities', label: 'Opportunities', icon: FaSearch },
          { id: 'internships', label: 'Internships', icon: FaBriefcase },
          { id: 'applications', label: 'My Applications', icon: FaFileAlt },
          { id: 'certificates', label: 'Certificates', icon: FaCertificate },
          { id: 'logbook', label: 'Logbook', icon: FaBook },
          { id: 'skills', label: 'Skill Center', icon: FaBookReader },
          { id: 'mentorship', label: 'Mentorship', icon: FaChalkboardTeacher },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id as any);
              if (window.innerWidth < 768) setIsSidebarOpen(false); // Auto close on mobile
            }}
            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${activeTab === item.id
              ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <item.icon className={`text-lg ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
            {item.label}
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Toggle Button (Visual only if needed, main toggle is absolute) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 z-50 transition-all duration-300 p-2 rounded-md ${isSidebarOpen ? 'left-52 text-gray-600' : 'left-4 bg-white shadow-md text-gray-600'}`}
      >
        <FaBars className="text-xl" />
      </button>

      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto">
          {/* Header Content */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">Student Dashboard</h1>
                  <p className="text-primary-100">Welcome back! Here's your overview</p>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-primary-200">Total Credits Earned</p>
                    <p className="text-3xl font-bold">{stats.totalCredits}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Link College Section */}
            {!user?.collegeId && profile?.approvalStatus?.toLowerCase() !== 'pending' && (
              <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-blue-900">Link to a College</h3>
                  <p className="text-blue-700">
                    Link your account to a college to apply for credit-based internships and get certified.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowVerificationForm(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Link College
                </button>
              </div>
            )}

            <CollegeVerificationForm
              isOpen={showVerificationForm}
              onClose={() => setShowVerificationForm(false)}
              onSuccess={() => {
                alert('Verification request sent successfully! Please wait for approval.');
                window.location.reload();
              }}
            />

            {/* Profile Section */}
            {!profileLoading && (
              <div className="mb-8">
                {!profile ? (
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Student Name'}</h2>
                      <p className="text-gray-600">{user?.email || 'student@example.com'}</p>
                      <p className="text-gray-600">Your profile is incomplete. Complete it to apply for internships.</p>
                    </div>
                    <button onClick={() => setShowProfileForm(true)} className="btn-primary">
                      Add Certifications
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">


                    <div onClick={() => setShowResumeView(true)} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition-shadow flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {profile.photoUrl ? (
                          <img src={`http://localhost:5000${profile.photoUrl}`} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <FaUser className="text-2xl text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{profile.firstName} {profile.lastName}</h3>
                        <p className="text-gray-600">Click to view your digital resume</p>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${profile.approvalStatus?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' : profile.approvalStatus?.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' : profile.approvalStatus?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          Status: {profile.approvalStatus || 'Not Linked'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            )}

            {showProfileForm && (
              <ProfileForm
                initialData={profile}
                onComplete={() => {
                  setShowProfileForm(false);
                  fetchProfile();
                }}
                onSkip={() => setShowProfileForm(false)}
                user={user}
              />
            )}

            {showResumeView && profile && (
              <ResumeView
                profile={profile}
                onClose={() => setShowResumeView(false)}
                onEdit={() => {
                  setShowResumeView(false);
                  setShowProfileForm(true);
                }}
              />
            )}
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Applications', value: stats.totalApplications, icon: FaFileAlt, color: 'blue' },
                { label: 'Active Internships', value: stats.activeInternships, icon: FaBriefcase, color: 'green' },
                { label: 'Completed', value: stats.completedInternships, icon: FaCheckCircle, color: 'purple' },
                { label: 'Total Credits', value: stats.totalCredits, icon: FaGraduationCap, color: 'orange' },
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



            {/* Tab Content */}
            <div className="space-y-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <FaSpinner className="animate-spin text-4xl text-primary-600" />
                </div>
              ) : (
                <>
                  {/* Opportunities Tab */}
                  {activeTab === 'opportunities' && (
                    <div>
                      {/* Search */}
                      <div className="card mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search internships..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="input-field pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Opportunities List */}
                      <div className="space-y-4">
                        {filteredOpportunities.length === 0 ? (
                          <div className="card text-center py-12">
                            <p className="text-gray-600">No internships found</p>
                          </div>
                        ) : (
                          filteredOpportunities.map((opp, idx) => (
                            <motion.div
                              key={opp.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: idx * 0.1 }}
                              className="card hover:shadow-xl transition-shadow"
                            >
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <FaBuilding className="text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700">{opp.company_name || 'Company'}</span>
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {opp.internship_title || opp.title || 'Internship Position'}
                                  </h3>
                                  <p className="text-gray-600 mb-3 line-clamp-2">
                                    {opp.short_description || opp.description || 'No description available'}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                    {opp.work_mode && (
                                      <span className="flex items-center gap-1">
                                        <FaBriefcase className="text-gray-400" /> {opp.work_mode}
                                      </span>
                                    )}
                                    {opp.location_city && (
                                      <span className="flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-gray-400" /> {opp.location_city}
                                      </span>
                                    )}
                                    {opp.duration && (
                                      <span className="flex items-center gap-1">
                                        <FaClock className="text-gray-400" /> {opp.duration}
                                      </span>
                                    )}
                                    {(opp.stipend_type || opp.amount) && (
                                      <span className="flex items-center gap-1">
                                        <FaMoneyBillWave className="text-gray-400" />
                                        {opp.stipend_type === 'Fixed' && opp.amount
                                          ? `₹${opp.amount}`
                                          : opp.stipend_type || 'Unpaid'}
                                      </span>
                                    )}
                                  </div>
                                  {opp.key_skills && (
                                    <div className="flex flex-wrap gap-2">
                                      {(Array.isArray(opp.key_skills) ? opp.key_skills : [opp.key_skills]).map((skill: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Link
                                    href={`/apply?id=${opp.id}`}
                                    className="btn-primary whitespace-nowrap"
                                  >
                                    Apply Now
                                  </Link>
                                  <button className="btn-secondary">
                                    <FaEye />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Applications Tab */}
                  {activeTab === 'applications' && (
                    <div className="space-y-4">
                      {applications.length === 0 ? (
                        <div className="card text-center py-12">
                          <p className="text-gray-600">No applications yet</p>
                        </div>
                      ) : (
                        applications.map((app, idx) => (
                          <motion.div
                            key={app.application_id || app.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="card"
                          >
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <FaBuilding className="text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700">
                                      {app.company_name || 'Company'}
                                    </span>
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {app.internship_title || app.internship?.title || 'Internship Position'}
                                  </h3>
                                  {app.short_description && (
                                    <p className="text-gray-600 mb-3 line-clamp-2">{app.short_description}</p>
                                  )}
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                                    {app.work_mode && (
                                      <span className="flex items-center gap-1">
                                        <FaBriefcase className="text-gray-400" /> {app.work_mode}
                                      </span>
                                    )}
                                    {app.location_city && (
                                      <span className="flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-gray-400" /> {app.location_city}
                                      </span>
                                    )}
                                    {app.duration && (
                                      <span className="flex items-center gap-1">
                                        <FaClock className="text-gray-400" /> {app.duration}
                                      </span>
                                    )}
                                    {(app.stipend_type || app.amount) && (
                                      <span className="flex items-center gap-1">
                                        <FaMoneyBillWave className="text-gray-400" />
                                        {app.stipend_type === 'Fixed' && app.amount
                                          ? `₹${app.amount}`
                                          : app.stipend_type || 'Unpaid'}
                                      </span>
                                    )}
                                  </div>
                                  {app.key_skills && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {(Array.isArray(app.key_skills) ? app.key_skills : [app.key_skills]).map((skill: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <span
                                    className={`px-4 py-2 rounded-full text-sm font-semibold ${app.job_status === 'Shortlisted' || app.status === 'Accepted'
                                      ? 'bg-green-100 text-green-700'
                                      : app.job_status === 'Rejected' || app.status === 'Rejected'
                                        ? 'bg-red-100 text-red-700'
                                        : app.job_status === 'Completed' || app.status === 'Completed'
                                          ? 'bg-purple-100 text-purple-700'
                                          : 'bg-yellow-100 text-yellow-700'
                                      }`}
                                  >
                                    {app.job_status || app.status || 'Pending'}
                                  </span>
                                  <button className="btn-secondary">
                                    <FaEye /> View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Internships Tab (New) */}
                  {activeTab === 'internships' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-800">Available Internships</h2>
                      {loading ? (
                        <div className="text-center py-10">Loading...</div>
                      ) : internships.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No internships available at the moment.</div>
                      ) : (
                        <div className="grid gap-6">
                          {internships.map((internship) => (
                            <motion.div
                              key={internship.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                              <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    {internship.postedBy?.companyProfile?.companyLogoUrl ? (
                                      <img
                                        src={internship.postedBy.companyProfile.companyLogoUrl}
                                        alt="Logo"
                                        className="w-10 h-10 rounded object-cover"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                                        <FaBuilding className="text-gray-400" />
                                      </div>
                                    )}
                                    <div>
                                      <h3 className="text-xl font-bold text-gray-800">{internship.title}</h3>
                                      <p className="text-sm text-gray-600">{internship.postedBy?.companyName}</p>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                                    <span className="flex items-center gap-1">
                                      <FaMapMarkerAlt /> {internship.workMode === 'Remote' ? 'Remote' : internship.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <FaClock /> {internship.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <FaMoneyBillWave /> {internship.stipendType === 'Paid' ? `₹${internship.stipendAmount}/mo` : internship.stipendType}
                                    </span>
                                  </div>

                                  <div className="mt-3">
                                    <p className="text-gray-700 line-clamp-2">{internship.description}</p>
                                  </div>

                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {internship.skills.split(',').map((skill: string, idx: number) => (
                                      <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                                        {skill.trim()}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex flex-col items-end justify-between min-w-[150px]">
                                  <div className="text-sm text-gray-500">
                                    Apply by {new Date(internship.applicationDeadline).toLocaleDateString()}
                                  </div>

                                  {applyingId === internship.id ? (
                                    <div className="w-full mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF)</label>
                                      <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                      />
                                      <div className="flex gap-2 mt-3">
                                        <button
                                          onClick={() => setApplyingId(null)}
                                          className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() => handleApply(internship.id)}
                                          className="flex-1 px-3 py-2 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                                        >
                                          Submit
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setApplyingId(internship.id)}
                                      className="btn-primary w-full mt-4"
                                    >
                                      Apply Now
                                    </button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Certificates Tab */}
                  {activeTab === 'certificates' && (
                    <div className="space-y-4">
                      {certificates.length === 0 ? (
                        <div className="card text-center py-12">
                          <p className="text-gray-600">No certificates yet</p>
                        </div>
                      ) : (
                        certificates.map((cert, idx) => (
                          <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="card"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FaCertificate className="text-3xl text-primary-600" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-1">{cert.title}</h3>
                                  <p className="text-gray-600 mb-2">{cert.company}</p>
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className="text-gray-500">Completed: {cert.completionDate}</span>
                                    <span className="flex items-center gap-1 text-primary-600 font-semibold">
                                      <FaAward /> {cert.credits} Credits
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button className="btn-primary">
                                  <FaDownload /> Download
                                </button>
                                <button className="btn-secondary">
                                  <FaEye /> View
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Logbook Tab */}
                  {activeTab === 'logbook' && (
                    <div className="space-y-6">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">My Logbook</h2>
                        <p className="text-gray-600 mb-4">Track your daily progress and achievements</p>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                          <textarea
                            value={newLogEntry}
                            onChange={(e) => setNewLogEntry(e.target.value)}
                            placeholder="What did you work on today? (Markdown supported)"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px] resize-y"
                          />
                          <div className="flex justify-between items-center mt-3">
                            <select
                              value={newLogStatus}
                              onChange={(e) => setNewLogStatus(e.target.value)}
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                            >
                              {LOG_STATUSES.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                            <button
                              disabled={!newLogEntry.trim() || isSubmittingLog}
                              onClick={() => {
                                setIsSubmittingLog(true);
                                logbooksAPI.create(newLogEntry, newLogStatus)
                                  .then(() => {
                                    setNewLogEntry('');
                                    setNewLogStatus('In Progress');
                                    alert("Log entry added!");
                                    fetchData();
                                  })
                                  .catch(err => alert("Failed to add entry. Please check connection."))
                                  .finally(() => setIsSubmittingLog(false));
                              }}
                              className={`btn-primary px-6 ${isSubmittingLog ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {isSubmittingLog ? <FaSpinner className="animate-spin" /> : 'Post Entry'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {logbooks.length === 0 ? (
                        <div className="text-center py-10 card">
                          <FaBook className="text-4xl text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No log entries yet. Start tracking your journey!</p>
                        </div>
                      ) : (
                        <div className="relative border-l-2 border-primary-200 ml-4 space-y-8 pb-8">
                          {logbooks.map((entry, idx) => (
                            <motion.div
                              key={entry.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="relative pl-8"
                            >
                              <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${entry.status === 'Completed' ? 'bg-green-500' :
                                  entry.status === 'Aborted' ? 'bg-red-500' : 'bg-primary-500'
                                }`}></div>

                              <div className="card hover:shadow-md transition-shadow">
                                {editingId === entry.id ? (
                                  <div className="space-y-3">
                                    <textarea
                                      value={editContent}
                                      onChange={(e) => setEditContent(e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded-md"
                                      rows={3}
                                    />
                                    <div className="flex gap-2">
                                      <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                        className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                                      >
                                        {LOG_STATUSES.map(status => (
                                          <option key={status} value={status}>{status}</option>
                                        ))}
                                      </select>
                                      <div className="flex-1"></div>
                                      <button
                                        onClick={() => setEditingId(null)}
                                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => {
                                          logbooksAPI.update(entry.id, editContent, editStatus)
                                            .then(() => {
                                              setEditingId(null);
                                              fetchData();
                                            })
                                            .catch(() => alert("Failed to update"));
                                        }}
                                        className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="text-sm text-gray-400 font-mono">
                                        {new Date(entry.date || entry.created_at).toLocaleDateString('en-US', {
                                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${entry.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            entry.status === 'Aborted' ? 'bg-red-100 text-red-800' :
                                              'bg-blue-100 text-blue-800'
                                          }`}>
                                          {entry.status || 'In Progress'}
                                        </span>
                                        <button
                                          onClick={() => {
                                            setEditingId(entry.id);
                                            setEditContent(entry.content);
                                            setEditStatus(entry.status || 'In Progress');
                                          }}
                                          className="text-gray-400 hover:text-blue-600 p-1"
                                          title="Edit"
                                        >
                                          <FaEdit />
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (confirm("Are you sure you want to delete this entry?")) {
                                              logbooksAPI.delete(entry.id)
                                                .then(() => fetchData())
                                                .catch(() => alert("Failed to delete"));
                                            }
                                          }}
                                          className="text-gray-400 hover:text-red-600 p-1"
                                          title="Delete"
                                        >
                                          <FaTrash />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                                      {entry.content}
                                    </div>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Skills Tab */}
                  {activeTab === 'skills' && (
                    <div className="space-y-6">
                      <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
                        <h3 className="text-xl font-bold text-yellow-800 mb-2">Skill Readiness Program</h3>
                        <p className="text-yellow-700">Complete these modules to improve your internship chances.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { title: 'Professional Communication', progress: 80, total: 10, completed: 8 },
                          { title: 'Technical Interview Prep', progress: 40, total: 15, completed: 6 },
                          { title: 'Workplace Etiquette', progress: 0, total: 5, completed: 0 },
                          { title: 'Resume Building', progress: 100, total: 4, completed: 4 },
                        ].map((skill, idx) => (
                          <div key={idx} className="card">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-bold text-gray-800">{skill.title}</h4>
                              <span className="text-sm text-gray-500">{skill.completed}/{skill.total} Modules</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                              <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${skill.progress}%` }}></div>
                            </div>
                            <button className="btn-primary w-full text-sm">
                              {skill.progress === 100 ? 'Review' : skill.progress === 0 ? 'Start' : 'Continue'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mentorship Tab */}
                  {activeTab === 'mentorship' && (
                    <div className="space-y-6">
                      <div className="card">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">My Mentor</h3>
                        <div className="flex flex-col md:flex-row items-start gap-6">
                          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                            <FaChalkboardTeacher className="text-4xl text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold">Dr. Sarah Johnson</h4>
                            <p className="text-gray-600 mb-2">Department of Computer Science</p>
                            <p className="text-sm text-gray-500 mb-4">
                              "I am here to guide you through your internship journey. Feel free to reach out for career advice or project help."
                            </p>
                            <div className="flex gap-3">
                              <button className="btn-primary flex items-center gap-2">
                                <FaVideo /> Schedule Meeting
                              </button>
                              <button className="btn-secondary flex items-center gap-2">
                                <FaCalendarAlt /> View Schedule
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Mentorship Sessions</h3>
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                            <div>
                              <p className="font-semibold">Internship Report Review</p>
                              <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Upcoming</span>
                          </div>
                          <div className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                            <div>
                              <p className="font-semibold">Career Guidance</p>
                              <p className="text-xs text-gray-500">Last Week</p>
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Completed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(StudentDashboard, ['Student']);
