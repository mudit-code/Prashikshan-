import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaGraduationCap, FaBriefcase, FaCertificate, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';

interface StudentProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any; // Using any for now to match the complex nested structure, can be typed strictly later
}

const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ isOpen, onClose, student }) => {
    if (!isOpen || !student) return null;

    const { studentProfile } = student;
    const { education, workExperience, certifications, socialLinks, address } = studentProfile || {};

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <FaUser className="text-primary-600" />
                            Applicant Profile
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                            <FaTimes size={24} />
                        </button>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Personal Info */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border-4 border-white shadow-lg">
                                {studentProfile?.photoUrl ? (
                                    <img
                                        src={studentProfile.photoUrl.startsWith('http') ? studentProfile.photoUrl : `http://localhost:5000/${studentProfile.photoUrl}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <FaUser size={48} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                    {studentProfile?.firstName} {studentProfile?.lastName}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <FaEnvelope className="text-primary-500" />
                                        {student.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaPhone className="text-primary-500" />
                                        {studentProfile?.mobileNumber || 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-primary-500" />
                                        {address ? `${address.city}, ${address.state}` : 'Location not available'}
                                    </div>
                                </div>

                                {/* Social Links */}
                                {socialLinks && (
                                    <div className="flex gap-4 mt-4">
                                        {socialLinks.linkedin && (
                                            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                                <FaLinkedin size={24} />
                                            </a>
                                        )}
                                        {socialLinks.github && (
                                            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black">
                                                <FaGithub size={24} />
                                            </a>
                                        )}
                                        {socialLinks.portfolio && (
                                            <a href={socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
                                                <FaGlobe size={24} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr />

                        {/* Education */}
                        <div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FaGraduationCap className="text-primary-600" />
                                Education
                            </h4>
                            <div className="space-y-4">
                                {education && education.length > 0 ? (
                                    education.map((edu: any, index: number) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h5 className="font-bold text-gray-900">{edu.level}</h5>
                                                    <p className="text-gray-700">{edu.schoolName || edu.collegeName}</p>
                                                    {edu.course && <p className="text-sm text-gray-600">{edu.course} - {edu.branch}</p>}
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-block bg-white px-2 py-1 rounded text-sm font-medium text-gray-600 border">
                                                        {edu.yearOfPassing}
                                                    </span>
                                                    {edu.cgpaOrPercentage && (
                                                        <p className="text-sm font-semibold text-primary-600 mt-1">
                                                            {edu.cgpaOrPercentage}% / CGPA
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No education details added.</p>
                                )}
                            </div>
                        </div>

                        {/* Work Experience */}
                        <div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FaBriefcase className="text-primary-600" />
                                Work Experience
                            </h4>
                            <div className="space-y-4">
                                {workExperience && workExperience.length > 0 ? (
                                    workExperience.map((exp: any, index: number) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h5 className="font-bold text-gray-900">{exp.role}</h5>
                                                    <p className="text-gray-700 font-medium">{exp.company}</p>
                                                    {exp.description && <p className="text-sm text-gray-600 mt-2">{exp.description}</p>}
                                                </div>
                                                <div className="text-right text-sm text-gray-500">
                                                    {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No work experience added.</p>
                                )}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FaCertificate className="text-primary-600" />
                                Certifications
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {certifications && certifications.length > 0 ? (
                                    certifications.map((cert: any, index: number) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <h5 className="font-bold text-gray-900">{cert.title}</h5>
                                            <p className="text-sm text-gray-600">Issued by: {cert.issuedBy}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(cert.issuedOn).toLocaleDateString()}
                                            </p>
                                            {cert.certificateUrl && (
                                                <a
                                                    href={cert.certificateUrl.startsWith('http') ? cert.certificateUrl : `http://localhost:5000/${cert.certificateUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary-600 hover:underline mt-2 inline-block"
                                                >
                                                    View Certificate
                                                </a>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic col-span-2">No certifications added.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default StudentProfileModal;
