import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe, FaTimes, FaEdit } from 'react-icons/fa';

interface ResumeViewProps {
    profile: any;
    onClose: () => void;
    onEdit: () => void;
    user?: any;
}

const ResumeView: React.FC<ResumeViewProps> = ({ profile, onClose, onEdit, user }) => {
    if (!profile) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-0 relative overflow-hidden flex flex-col md:flex-row min-h-[80vh]"
            >
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button onClick={onEdit} className="bg-white rounded-full p-2 text-primary-600 hover:text-primary-800 shadow-md" title="Edit Profile">
                        <FaEdit />
                    </button>
                    <button onClick={onClose} className="bg-white rounded-full p-2 text-gray-500 hover:text-gray-700 shadow-md" title="Close">
                        <FaTimes />
                    </button>
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-1/3 bg-slate-800 text-white p-8">
                    <div className="text-center mb-8">
                        {profile.photoUrl ? (
                            <img src={`http://localhost:5000${profile.photoUrl}`} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white/20" />
                        ) : (
                            <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-slate-600 flex items-center justify-center text-4xl font-bold">
                                {profile.firstName?.[0]}{profile.lastName?.[0]}
                            </div>
                        )}
                        <h2 className="text-2xl font-bold">{user?.name || `${profile.firstName} ${profile.lastName}`}</h2>
                        <p className="text-slate-300">Student</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3">
                            <FaEnvelope className="text-slate-400" />
                            <span className="text-sm">{profile.user?.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaPhone className="text-slate-400" />
                            <span className="text-sm">{profile.mobileNumber}</span>
                        </div>
                        {profile.address && (
                            <div className="flex items-center gap-3">
                                <FaMapMarkerAlt className="text-slate-400" />
                                <span className="text-sm">{profile.address.city}, {profile.address.state}</span>
                            </div>
                        )}
                    </div>

                    {profile.socialLinks && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b border-slate-600 pb-2 mb-4">Social Links</h3>
                            {profile.socialLinks.linkedin && (
                                <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-blue-400 transition-colors">
                                    <FaLinkedin /> LinkedIn
                                </a>
                            )}
                            {profile.socialLinks.github && (
                                <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-gray-400 transition-colors">
                                    <FaGithub /> GitHub
                                </a>
                            )}
                            {profile.socialLinks.portfolio && (
                                <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-green-400 transition-colors">
                                    <FaGlobe /> Portfolio
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="w-full md:w-2/3 p-8 bg-white">
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Education</h3>
                        <div className="space-y-4">
                            {profile.education?.map((edu: any, idx: number) => (
                                <div key={idx}>
                                    <h4 className="font-bold text-slate-700">{edu.level}</h4>
                                    <p className="text-slate-600">{edu.schoolName || edu.collegeName}</p>
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>{edu.boardName || edu.universityName}</span>
                                        <span>{edu.yearOfPassing}</span>
                                    </div>
                                    {edu.cgpaOrPercentage && <p className="text-sm text-slate-500">Score: {edu.cgpaOrPercentage}</p>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {profile.workExperience?.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Experience</h3>
                            <div className="space-y-4">
                                {profile.workExperience.map((exp: any, idx: number) => (
                                    <div key={idx}>
                                        <h4 className="font-bold text-slate-700">{exp.role}</h4>
                                        <p className="text-slate-600">{exp.company}</p>
                                        <div className="flex justify-between text-sm text-slate-500">
                                            <span>{new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {profile.certifications?.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Certifications</h3>
                            <div className="space-y-4">
                                {profile.certifications.map((cert: any, idx: number) => (
                                    <div key={idx}>
                                        <h4 className="font-bold text-slate-700">{cert.title}</h4>
                                        <p className="text-slate-600">{cert.issuedBy}</p>
                                        <p className="text-sm text-slate-500">{new Date(cert.issuedOn).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ResumeView;
