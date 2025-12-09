import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaGraduationCap,
  FaBriefcase,
  FaChartLine,
  FaCertificate,
  FaArrowRight,
  FaUsers,
  FaHandshake
} from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#F5F5DC] text-gray-900 overflow-hidden">
        {/* Animated Background Elements */}


        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="/images/logo.png"
              alt="Prashikshan Logo"
              className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl mb-6 mx-auto"
            />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Prashikshan
            </h1>
            <p className="text-2xl md:text-3xl mb-4 font-light">
              A unified Internship ecosystem
            </p>
            <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto opacity-90">
              Transforming the internship into a structured, reliable and collaborative workflow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/guest/about" className="btn-primary bg-[#4A3728] text-white border border-[#4A3728] hover:bg-[#3E2723] text-lg px-8 py-4 inline-flex items-center gap-2">
                Explore <FaArrowRight />
              </Link>
              <Link href="/guest/about#about" className="btn-secondary text-lg px-8 py-4 bg-gray-900/5 backdrop-blur-sm border-gray-900/10 text-gray-900 hover:bg-gray-900/10">
                Know More
              </Link>
            </div>
          </motion.div>
        </div>


      </section>

      {/* Features Section */}
      <section className="py-20 bg-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Prashikshan?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A comprehensive platform designed for students, colleges, and employers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FaGraduationCap, title: 'Best Opportunities', desc: 'Find internships matching your skills and academics' },
              { icon: FaCertificate, title: 'Recognition & Credits', desc: 'Get certificates and course credits for your work' },
              { icon: FaChartLine, title: 'Auto Logbook', desc: 'Automated logbook and report generation' },
              { icon: FaBriefcase, title: 'Career Growth', desc: 'Build your professional profile and network' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="card text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4A3728]/10 rounded-full mb-4 group-hover:bg-[#4A3728] transition-colors duration-300">
                  <feature.icon className="text-3xl text-[#4A3728] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
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
            <FaUsers className="text-6xl mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students, colleges, and employers already using Prashikshan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary bg-white text-[#4A3728] hover:bg-gray-100 text-lg px-8 py-4">
                Create Account
              </Link>
              <Link href="/login" className="px-8 py-4 rounded-lg font-semibold border-2 border-white text-white hover:bg-white/10 transition-all duration-200 shadow-md hover:shadow-lg text-lg">
                Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
