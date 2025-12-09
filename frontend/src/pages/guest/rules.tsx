import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaBook,
  FaUserGraduate,
  FaUniversity,
  FaBuilding,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaInfoCircle
} from 'react-icons/fa';

const RulesPage = () => {
  const studentRules = [
    'Maintain accurate profile information including skills and academics',
    'Apply only to internships that match your qualifications',
    'Complete all required logbook entries during your internship',
    'Submit reports on time as per the schedule',
    'Maintain professional conduct with employers',
    'Notify college admin about any issues or concerns',
  ];

  const adminRules = [
    'Verify student credentials before approving applications',
    'Monitor student progress and provide necessary support',
    'Coordinate with employers for smooth internship execution',
    'Ensure all students follow platform guidelines',
    'Review and approve certificates and credits',
    'Maintain communication with both students and employers',
  ];

  const employerRules = [
    'Post accurate and detailed internship descriptions',
    'Respond to applications within reasonable time',
    'Provide clear expectations and feedback to students',
    'Review and approve student logbooks regularly',
    'Issue certificates upon successful completion',
    'Maintain professional and respectful communication',
  ];

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      {/* Hero Section */}
      <section className="bg-[#4A3728] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <FaBook className="text-6xl mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Rules & Instructions</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Guidelines for students, college admins, and employers
            </p>
          </motion.div>
        </div>
      </section>

      {/* General Guidelines */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card max-w-4xl mx-auto mb-12"
          >
            <div className="flex items-start gap-4 mb-6">
              <FaInfoCircle className="text-3xl text-[#4A3728] flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">General Guidelines</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <span>All users must maintain professional conduct and respect platform policies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <span>Any fraudulent activity will result in immediate account suspension</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <span>Keep your account information secure and up-to-date</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <span>Report any issues or concerns through the helpdesk</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Role-specific Rules */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Student Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#4A3728]/10 rounded-full flex items-center justify-center">
                  <FaUserGraduate className="text-2xl text-[#4A3728]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For Students</h3>
              </div>
              <ul className="space-y-3">
                {studentRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#4A3728] text-lg mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Admin Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#3E2723]/10 rounded-full flex items-center justify-center">
                  <FaUniversity className="text-2xl text-[#3E2723]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For College Admins</h3>
              </div>
              <ul className="space-y-3">
                {adminRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#3E2723] text-lg mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Employer Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#5D4037]/10 rounded-full flex items-center justify-center">
                  <FaBuilding className="text-2xl text-[#5D4037]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For Employers</h3>
              </div>
              <ul className="space-y-3">
                {employerRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#5D4037] text-lg mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-20 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card max-w-4xl mx-auto border-l-4 border-yellow-500"
          >
            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="text-3xl text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Important Notes</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• All logbook entries are automatically tracked and cannot be edited after submission</li>
                  <li>• Certificates are issued only upon successful completion of the internship</li>
                  <li>• Course credits are subject to college approval and policies</li>
                  <li>• Any disputes should be reported immediately through the helpdesk</li>
                  <li>• Platform reserves the right to suspend accounts violating terms of service</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#4A3728] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Explore Learning Resources
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Discover career paths and get personalized guidance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/guest/resources"
                className="btn-primary bg-white text-[#4A3728] hover:bg-gray-100 text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                View Resources <FaArrowRight />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-lg font-semibold border-2 border-white text-white hover:bg-white/10 transition-all duration-200 shadow-md hover:shadow-lg text-lg"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RulesPage;
