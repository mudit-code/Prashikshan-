import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    FaUser,
    FaBuilding,
    FaUniversity,
    FaGraduationCap,
    FaBriefcase,
    FaArrowLeft
} from 'react-icons/fa';

const SelectRolePage = () => {
    const roles = [
        { id: 'Student', label: 'Student', icon: FaGraduationCap, description: 'Apply for internships, track progress, and build your career.' },
        { id: 'College Admin', label: 'College Admin', icon: FaUniversity, description: 'Oversee the entire platform, manage colleges, and generate reports.' },
        { id: 'Employer', label: 'Employer', icon: FaBriefcase, description: 'Post internships, review applications, and hire top talent.' },
        { id: 'State Admin', label: 'State Admin', icon: FaUniversity, description: 'Oversee state-level data, manage colleges, and monitor performance.' },
    ];

    return (
        <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Role</h2>
                    <p className="text-xl text-gray-600">Select how you want to join Prashikshan</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {roles.map((role, index) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Link
                                href={`/register?role=${role.id}`}
                                className="block h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 group cursor-pointer border border-transparent hover:border-[#4A3728]/20"
                            >
                                <div className="flex flex-col items-center text-center h-full">
                                    <div className="w-16 h-16 bg-[#4A3728]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#4A3728]/20 transition-colors">
                                        <role.icon className="text-3xl text-[#4A3728]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{role.label}</h3>
                                    <p className="text-sm text-gray-500">{role.description}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <Link href="/login-selection" className="inline-flex items-center text-gray-600 hover:text-[#4A3728] transition-colors font-medium">
                        <FaArrowLeft className="mr-2" /> Back to Login
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default SelectRolePage;
