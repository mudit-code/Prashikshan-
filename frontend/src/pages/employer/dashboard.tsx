import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  FaBriefcase,
  FaUsers,
  FaChartLine,
  FaPlus,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaSignOutAlt,
  FaBuilding
} from 'react-icons/fa';
import { authAPI } from '../../lib/api';
import CompanyProfileForm from '../../components/company/CompanyProfileForm';
import PostInternshipForm from '../../components/employer/PostInternshipForm';
import StudentProfileModal from '../../components/employer/StudentProfileModal';
import { internshipsAPI, applicationsAPI } from '../../lib/api';
import withAuth from '../../components/withAuth';

interface EmployerDashboardProps {
  user?: {
    id: number;
    name: string;
    email: string;
    role: {
      id: number;
      name: string;
    };
  };
}

const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ user }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPostInternship, setShowPostInternship] = useState(false);
  const [internships, setInternships] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'internships') {
      fetchInternships();
    } else if (activeTab === 'applicants') {
      if (selectedInternship) {
        fetchApplicants(selectedInternship);
      } else {
        // If no internship selected, maybe fetch all? Or wait for selection.
        // For now, let's fetch internships to populate the dropdown
        fetchInternships();
        setApplicants([]);
      }
    }
  }, [activeTab, selectedInternship]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const data = await internshipsAPI.getCompanyInternships();
      setInternships(data);
    } catch (error) {
      console.error('Failed to fetch internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (internshipId: number) => {
    try {
      setLoading(true);
      const data = await internshipsAPI.getInternshipApplications(internshipId);
      setApplicants(data);
    } catch (error) {
      console.error('Failed to fetch applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: number, status: string) => {
    try {
      await applicationsAPI.updateStatus(applicationId, status);
      if (selectedInternship) {
        fetchApplicants(selectedInternship);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update status');
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const renderContent = () => {
    if (showPostInternship) {
      return (
        <PostInternshipForm
          onSuccess={() => {
            setShowPostInternship(false);
            setActiveTab('internships');
            fetchInternships();
          }}
          onCancel={() => setShowPostInternship(false)}
        />
      );
    }

    if (showProfileForm) {
      return (
        <CompanyProfileForm
          onComplete={() => setShowProfileForm(false)}
          onSkip={() => setShowProfileForm(false)}
          user={user}
        />
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <FaBriefcase className="text-xl" />
                </div>
                <span className="text-sm text-gray-500">Total Posted</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">{internships.length}</h3>
              <p className="text-sm text-gray-500 mt-2">Active Internships</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                  <FaUsers className="text-xl" />
                </div>
                <span className="text-sm text-gray-500">Total Applicants</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">
                {internships.reduce((acc, curr) => acc + (curr._count?.applications || 0), 0)}
              </h3>
              <p className="text-sm text-gray-500 mt-2">Across all roles</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              onClick={() => setShowPostInternship(true)}
              className="bg-gradient-to-br from-primary-600 to-primary-700 p-6 rounded-xl shadow-lg text-white cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <FaPlus className="text-xl" />
                </div>
                <span className="text-sm text-white/80">Quick Action</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">Post New Internship</h3>
              <p className="text-sm text-white/80">Find your next talent</p>
            </motion.div>
          </div>
        );

      case 'internships':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">My Internships</h2>
              <button
                onClick={() => setShowPostInternship(true)}
                className="btn-primary flex items-center gap-2 px-4 py-2"
              >
                <FaPlus /> Post New
              </button>
            </div>

            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : internships.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <FaBriefcase className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No internships posted yet</h3>
                <p className="text-gray-500 mb-4">Start hiring by posting your first internship</p>
                <button
                  onClick={() => setShowPostInternship(true)}
                  className="text-primary-600 font-medium hover:underline"
                >
                  Post Internship Now
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {internships.map((internship) => (
                  <div key={internship.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{internship.title}</h3>
                        <div className="flex gap-3 mt-2 text-sm text-gray-600">
                          <span className="bg-gray-100 px-2 py-1 rounded">{internship.internshipType}</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">{internship.workMode}</span>
                          {internship.stipendType === 'Paid' && (
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
                              ₹{internship.stipendAmount}/mo
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                          {internship._count?.applications || 0}
                        </div>
                        <div className="text-xs text-gray-500">Applicants</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Posted on {formatDate(internship.createdAt)}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedInternship(internship.id);
                          setActiveTab('applicants');
                        }}
                        className="text-primary-600 font-medium hover:underline"
                      >
                        View Applications →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'applicants':
        return (
          <div className="space-y-6">
            <div className="card mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Internship to View Applications
              </label>
              <select
                value={selectedInternship || ''}
                onChange={(e) => setSelectedInternship(Number(e.target.value))}
                className="input-field"
              >
                <option value="">Select an internship...</option>
                {internships.map((posting) => (
                  <option key={posting.id} value={posting.id}>
                    {posting.title}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <FaSpinner className="animate-spin text-4xl text-purple-600" />
              </div>
            ) : (
              <div className="space-y-4">
                {applicants.length === 0 ? (
                  <div className="card text-center py-12">
                    <p className="text-gray-600">
                      {selectedInternship ? 'No applications for this internship yet' : 'Select an internship to view applications'}
                    </p>
                  </div>
                ) : (
                  applicants.map((applicant, idx) => (
                    <motion.div
                      key={applicant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="card"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{applicant.student?.name || 'N/A'}</h3>
                              <p className="text-gray-600">{applicant.student?.email || 'N/A'}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {applicant.student?.studentProfile?.education?.[0]?.degree} • {applicant.student?.studentProfile?.education?.[0]?.institution}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${applicant.status === 'Accepted'
                                ? 'bg-green-100 text-green-700'
                                : applicant.status === 'Rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                                }`}
                            >
                              {applicant.status}
                            </span>
                          </div>

                          <div className="flex gap-3 mb-3">
                            <button
                              onClick={() => setSelectedStudent(applicant.student)}
                              className="text-primary-600 hover:underline flex items-center gap-1 text-sm font-medium"
                            >
                              <FaEye /> View Profile
                            </button>
                            {applicant.resumeUrl && (
                              <a
                                href={`http://localhost:5000/${applicant.resumeUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:underline flex items-center gap-1 text-sm"
                              >
                                <FaEye /> View Resume
                              </a>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <span>Applied: {formatDate(applicant.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {applicant.status === 'Pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateApplicationStatus(applicant.id, 'Accepted')}
                                className="flex-1 btn-secondary text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <FaCheckCircle /> Accept
                              </button>
                              <button
                                onClick={() => handleUpdateApplicationStatus(applicant.id, 'Rejected')}
                                className="flex-1 btn-secondary text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <FaTimesCircle /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Employer Dashboard</h1>
              <p className="text-purple-100">Manage your internships and find the best talent</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setShowPostInternship(true)}
                className="btn-primary bg-white text-purple-600 hover:bg-gray-100"
              >
                <FaPlus /> Post New Internship
              </button>
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
        {/* Tabs */}
        {!showPostInternship && !showProfileForm && (
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: FaChartLine },
                  { id: 'internships', label: 'My Internships', icon: FaBriefcase },
                  { id: 'applicants', label: 'Applicants', icon: FaUsers },
                  { id: 'profile', label: 'Company Profile', icon: FaBuilding },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.id === 'profile') {
                        setShowProfileForm(true);
                      } else {
                        setActiveTab(tab.id);
                      }
                    }}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id && tab.id !== 'profile'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <tab.icon />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {renderContent()}
      </div>

      <StudentProfileModal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        student={selectedStudent}
      />
    </div>
  );
};

export default withAuth(EmployerDashboard, ['Employer']);
