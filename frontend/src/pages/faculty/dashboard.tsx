import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
    FaBook,
    FaUsers,
    FaChartLine,
    FaPlus,
    FaEye,
    FaSpinner,
    FaSignOutAlt,
    FaUniversity,
    FaGraduationCap
} from 'react-icons/fa';
import { authAPI, coursesAPI, collegeAPI } from '../../lib/api';
import withAuth from '../../components/withAuth';
import PostCourseForm from '../../components/faculty/PostCourseForm';

interface FacultyDashboardProps {
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

const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ user }) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [showPostCourse, setShowPostCourse] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'courses') {
            fetchCourses();
        } else if (activeTab === 'students') {
            fetchStudents();
        } else if (activeTab === 'overview') {
            fetchCourses();
            fetchStudents();
        }
    }, [activeTab]);

    const fetchCourses = async () => {
        try {
            // In a real scenario, this would be getMyCourses
            // For now, we reuse the general getAll or mock it if needed
            const data = await coursesAPI.getAll().catch(() => []);
            setCourses(data);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const data = await collegeAPI.getApprovedStudents();
            setStudents(data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
            // Fallback for empty state if API fails
            setStudents([]);
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

    const renderContent = () => {
        if (showPostCourse) {
            return (
                <PostCourseForm
                    onSuccess={() => {
                        setShowPostCourse(false);
                        setActiveTab('courses');
                        fetchCourses();
                    }}
                    onCancel={() => setShowPostCourse(false)}
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
                                    <FaBook className="text-xl" />
                                </div>
                                <span className="text-sm text-gray-500">Active Courses</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800">{courses.length}</h3>
                            <p className="text-sm text-gray-500 mt-2">published by department</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                                    <FaUsers className="text-xl" />
                                </div>
                                <span className="text-sm text-gray-500">Total Students</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {students.length}
                            </h3>
                            <p className="text-sm text-gray-500 mt-2">Registered in college</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            onClick={() => setShowPostCourse(true)}
                            className="bg-gradient-to-br from-primary-600 to-primary-700 p-6 rounded-xl shadow-lg text-white cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <FaPlus className="text-xl" />
                                </div>
                                <span className="text-sm text-white/80">Quick Action</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">Publish New Course</h3>
                            <p className="text-sm text-white/80">Create curriculum for students</p>
                        </motion.div>
                    </div>
                );

            case 'courses':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Department Courses</h2>
                            <button
                                onClick={() => setShowPostCourse(true)}
                                className="btn-primary flex items-center gap-2 px-4 py-2"
                            >
                                <FaPlus /> Publish New
                            </button>
                        </div>

                        {courses.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <FaBook className="mx-auto text-4xl text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No courses published yet</h3>
                                <p className="text-gray-500 mb-4">Start by creating your first course</p>
                                <button
                                    onClick={() => setShowPostCourse(true)}
                                    className="text-primary-600 font-medium hover:underline"
                                >
                                    Publish Course Now
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {courses.map((course) => (
                                    <div key={course.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                                                <p className="text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                                                <div className="flex gap-3 mt-3 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1"><FaBook className="text-primary-500" /> {course.duration}</span>
                                                    {/* <span className="flex items-center gap-1"><FaUsers className="text-green-500"/> {course.enrolledCount || 0} Enrolled</span> */}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">Published</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'students':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Registered Students</h2>
                        {students.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-xl">
                                <FaUsers className="mx-auto text-4xl text-gray-300 mb-4" />
                                <p className="text-gray-500">No students found for your college.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {students.map((student) => (
                                            <tr key={student.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                                                {student.name?.charAt(0) || 'S'}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{student.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {student.studentProfile?.education?.[0]?.degree || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-wrap gap-1">
                                                        {student.studentProfile?.skills?.slice(0, 3).map((skill: string, i: number) => (
                                                            <span key={i} className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {student.studentProfile?.skills?.length > 3 && (
                                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                +{student.studentProfile.skills.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button className="text-primary-600 hover:text-primary-900">View Details</button>
                                        </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Faculty Dashboard</h1>
                            <p className="text-blue-100">Manage curriculum and track student progress</p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={() => setShowPostCourse(true)}
                                className="btn-primary bg-white text-blue-600 hover:bg-gray-100"
                            >
                                <FaPlus /> Publish Course
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
                {!showPostCourse && (
                    <div className="bg-white rounded-lg shadow-md mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px overflow-x-auto">
                                {[
                                    { id: 'overview', label: 'Overview', icon: FaChartLine },
                                    { id: 'courses', label: 'Courses', icon: FaBook },
                                    { id: 'students', label: 'Students', icon: FaUsers },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                            ? 'border-blue-600 text-blue-600'
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
        </div>
    );
};

export default withAuth(FacultyDashboard, ['Faculty']);
