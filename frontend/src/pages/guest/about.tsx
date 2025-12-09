import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaUniversity,
  FaBuilding,
  FaCheckCircle,
  FaArrowDown,
  FaBullseye,
  FaAward
} from 'react-icons/fa';

const AboutPage = () => {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Prashikshan</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Bridging the gap between students, colleges, and employers
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Prashikshan is a comprehensive internship platform designed to revolutionize
                how students find opportunities, colleges manage their students, and employers
                discover talent. We believe in empowering every student to reach their full
                potential through meaningful internships.
              </p>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Our platform seamlessly connects all stakeholders, ensuring that students get
                the best opportunities aligned with their skills, colleges can effectively
                track and manage student progress, and employers can find the perfect candidates
                for their organizations.
              </p>
              <div className="flex items-center gap-2 mt-6">
                <FaBullseye className="text-[#4A3728] text-2xl" />
                <span className="text-lg font-semibold text-gray-900">
                  Empowering Futures, One Internship at a Time
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { icon: FaUsers, number: '10K+', label: 'Active Students' },
                { icon: FaUniversity, number: '500+', label: 'Colleges' },
                { icon: FaBuilding, number: '2K+', label: 'Employers' },
                { icon: FaAward, number: '50K+', label: 'Internships' },
              ].map((stat, idx) => (
                <div key={idx} className="card text-center">
                  <stat.icon className="text-4xl text-[#4A3728] mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-[#F5F5DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              For Everyone
            </h2>
            <p className="text-xl text-gray-600">
              Tailored experiences for each role
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaUsers,
                title: 'Students',
                desc: 'Find the best opportunities matching your skills and academics. Get recognized with certificates and earn course credits. Auto-generated logbooks and reports.',
                color: 'from-[#4A3728] to-[#3E2723]',
              },
              {
                icon: FaUniversity,
                title: 'College Admin',
                desc: 'Manage all students from your college. Track internship progress, verify credentials, and ensure smooth coordination between students and employers.',
                color: 'from-green-500 to-green-700',
              },
              {
                icon: FaBuilding,
                title: 'Employers',
                desc: 'Post internships with ease using social media-style templates. Analyze applicants efficiently. Audit student logbooks and reports seamlessly.',
                color: 'from-purple-500 to-purple-700',
              },
            ].map((role, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="card group hover:scale-105 transition-transform duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${role.color} rounded-full mb-4 text-white`}>
                  <role.icon className="text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{role.title}</h3>
                <p className="text-gray-600 leading-relaxed">{role.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-20 bg-[#F5F5DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'Automated logbook and report generation',
              'Certificate and credit management',
              'Smart internship matching based on skills',
              'Comprehensive applicant analysis tools',
              'Real-time progress tracking',
              'Social media-style internship posting',
              'Career counseling and roadmap guidance',
              'Seamless multi-device support',
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm"
              >
                <FaCheckCircle className="text-[#4A3728] text-xl mt-1 flex-shrink-0" />
                <span className="text-gray-700 text-lg">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA to Rules */}
      <section className="py-20 bg-[#4A3728] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Learn More?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Check out our rules and guidelines to get started
            </p>
            <Link
              href="/guest/rules"
              className="btn-primary bg-white text-[#4A3728] hover:bg-gray-100 text-lg px-8 py-4 inline-flex items-center gap-2"
            >
              View Rules & Instructions <FaArrowDown />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
