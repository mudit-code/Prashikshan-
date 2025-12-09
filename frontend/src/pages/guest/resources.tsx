import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaBook,
  FaGraduationCap,
  FaLaptopCode,
  FaFlask,
  FaChartBar,
  FaPalette,
  FaStethoscope,
  FaBriefcase,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaCertificate,
  FaRoute
} from 'react-icons/fa';

const ResourcesPage = () => {
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'before12' | 'after12' | null>(null);

  const streams = [
    {
      id: 'engineering',
      name: 'Engineering & Technology',
      icon: FaLaptopCode,
      color: 'from-[#4A3728] to-[#3E2723]',
      careers: ['Software Engineer', 'Data Scientist', 'AI/ML Engineer', 'Cybersecurity Expert', 'DevOps Engineer'],
      roadmap: [
        { step: 'Foundation', desc: 'Master programming fundamentals (Python, Java, C++)', duration: '3-6 months' },
        { step: 'Specialization', desc: 'Choose a domain (Web Dev, Mobile, AI/ML, etc.)', duration: '6-12 months' },
        { step: 'Projects', desc: 'Build portfolio with real-world projects', duration: 'Ongoing' },
        { step: 'Internships', desc: 'Apply for internships to gain experience', duration: '3-6 months' },
        { step: 'Career', desc: 'Land your dream job or start freelancing', duration: 'Continuous' },
      ],
    },
    {
      id: 'science',
      name: 'Pure Sciences',
      icon: FaFlask,
      color: 'from-green-500 to-green-700',
      careers: ['Research Scientist', 'Lab Technician', 'Biotechnologist', 'Chemist', 'Physicist'],
      roadmap: [
        { step: 'Foundation', desc: 'Strong base in Physics, Chemistry, Biology/Mathematics', duration: '2-3 years' },
        { step: 'Higher Education', desc: 'Pursue B.Sc. and then M.Sc./Ph.D. in specialization', duration: '3-5 years' },
        { step: 'Research', desc: 'Engage in research projects and publications', duration: 'Ongoing' },
        { step: 'Internships', desc: 'Research internships at labs and institutions', duration: '6-12 months' },
        { step: 'Career', desc: 'Academic positions or industry research roles', duration: 'Continuous' },
      ],
    },
    {
      id: 'commerce',
      name: 'Commerce & Business',
      icon: FaChartBar,
      color: 'from-purple-500 to-purple-700',
      careers: ['Chartered Accountant', 'Financial Analyst', 'Business Consultant', 'Investment Banker', 'Entrepreneur'],
      roadmap: [
        { step: 'Foundation', desc: 'Strong understanding of accounts, economics, business', duration: '2-3 years' },
        { step: 'Professional Course', desc: 'CA, CS, CMA, or B.Com/M.Com/MBA', duration: '3-5 years' },
        { step: 'Certifications', desc: 'Get industry certifications (CFA, FRM, etc.)', duration: '1-2 years' },
        { step: 'Internships', desc: 'Internships at firms, banks, or startups', duration: '6-12 months' },
        { step: 'Career', desc: 'Join corporate or start your own business', duration: 'Continuous' },
      ],
    },
    {
      id: 'arts',
      name: 'Arts & Humanities',
      icon: FaPalette,
      color: 'from-pink-500 to-pink-700',
      careers: ['Content Writer', 'Journalist', 'Graphic Designer', 'Psychologist', 'Social Worker'],
      roadmap: [
        { step: 'Foundation', desc: 'Develop skills in chosen field (writing, design, etc.)', duration: '1-2 years' },
        { step: 'Education', desc: 'Pursue B.A. and then M.A. in specialization', duration: '3-5 years' },
        { step: 'Portfolio', desc: 'Build a strong portfolio of work', duration: 'Ongoing' },
        { step: 'Internships', desc: 'Internships at media houses, NGOs, agencies', duration: '3-6 months' },
        { step: 'Career', desc: 'Freelance or join organizations', duration: 'Continuous' },
      ],
    },
    {
      id: 'medical',
      name: 'Medical & Healthcare',
      icon: FaStethoscope,
      color: 'from-red-500 to-red-700',
      careers: ['Doctor', 'Nurse', 'Pharmacist', 'Physiotherapist', 'Medical Researcher'],
      roadmap: [
        { step: 'Foundation', desc: 'Strong base in Biology, Chemistry, Physics', duration: '2 years' },
        { step: 'Entrance Exams', desc: 'Clear NEET or other medical entrance exams', duration: '1-2 years' },
        { step: 'Medical School', desc: 'Complete MBBS/BDS or other medical degrees', duration: '5-6 years' },
        { step: 'Internships', desc: 'Medical internships and residency programs', duration: '1-3 years' },
        { step: 'Career', desc: 'Practice medicine or specialize further', duration: 'Continuous' },
      ],
    },
  ];

  const courses = [
    {
      title: 'Web Development Bootcamp',
      desc: 'Full-stack web development with modern frameworks',
      duration: '6 months',
      level: 'Beginner to Advanced',
      skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Database'],
    },
    {
      title: 'Data Science & Analytics',
      desc: 'Master data analysis, machine learning, and visualization',
      duration: '8 months',
      level: 'Intermediate',
      skills: ['Python', 'SQL', 'Machine Learning', 'Data Visualization'],
    },
    {
      title: 'Digital Marketing Certification',
      desc: 'Learn SEO, SEM, social media marketing, and analytics',
      duration: '4 months',
      level: 'Beginner',
      skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics'],
    },
    {
      title: 'UI/UX Design Masterclass',
      desc: 'Create beautiful and user-friendly interfaces',
      duration: '5 months',
      level: 'Beginner to Intermediate',
      skills: ['Figma', 'Design Principles', 'User Research', 'Prototyping'],
    },
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
            <FaGraduationCap className="text-6xl mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Learning Resources</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Your personal career counselor with roadmaps and courses
            </p>
          </motion.div>
        </div>
      </section>

      {/* Level Selection */}
      <section className="py-12 bg-[#F5F5DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setSelectedLevel('before12')}
              className={`px-8 py-4 rounded-lg font-semibold transition-all ${selectedLevel === 'before12'
                  ? 'bg-[#4A3728] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Before 12th
            </button>
            <button
              onClick={() => setSelectedLevel('after12')}
              className={`px-8 py-4 rounded-lg font-semibold transition-all ${selectedLevel === 'after12'
                  ? 'bg-[#4A3728] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              After 12th
            </button>
          </div>
        </div>
      </section>

      {/* Stream Selection */}
      {selectedLevel && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Stream
              </h2>
              <p className="text-gray-600">Select a stream to see detailed career roadmap</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {streams.map((stream) => (
                <motion.button
                  key={stream.id}
                  onClick={() => setSelectedStream(stream.id)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`card text-left group ${selectedStream === stream.id ? 'ring-2 ring-[#4A3728]' : ''
                    }`}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stream.color} rounded-full mb-4 text-white`}>
                    <stream.icon className="text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{stream.name}</h3>
                  <p className="text-gray-600 text-sm">Click to explore career paths</p>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Detailed Roadmap */}
      {selectedStream && (
        <section className="py-12 bg-[#F5F5DC]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {streams.find(s => s.id === selectedStream)?.name} Roadmap
                  </h2>
                  <p className="text-gray-600">Your step-by-step guide to success</p>
                </div>
                <button
                  onClick={() => setSelectedStream(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Career Options */}
              <div className="card mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-[#4A3728]" />
                  Career Options
                </h3>
                <div className="flex flex-wrap gap-2">
                  {streams.find(s => s.id === selectedStream)?.careers.map((career, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-[#4A3728]/10 text-[#4A3728] rounded-full text-sm font-medium"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>

              {/* Roadmap Steps */}
              <div className="space-y-6">
                {streams.find(s => s.id === selectedStream)?.roadmap.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="card relative pl-12"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4A3728]/20"></div>
                    <div className="absolute left-0 top-6 w-6 h-6 bg-[#4A3728] rounded-full border-4 border-white"></div>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaRoute className="text-[#4A3728]" />
                        {step.step}
                      </h4>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <FaClock className="text-xs" />
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-gray-700">{step.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/login"
                  className="btn-primary bg-[#4A3728] text-white hover:bg-[#3E2723] inline-flex items-center gap-2"
                >
                  Get Started <FaArrowRight />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Courses & Certifications */}
      <section className="py-20 bg-[#F5F5DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <FaCertificate className="text-5xl text-[#4A3728] mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Courses & Certifications
            </h2>
            <p className="text-xl text-gray-600">
              Enhance your skills with our curated courses
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="card group hover:shadow-2xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{course.title}</h3>
                  <FaCertificate className="text-3xl text-[#4A3728]" />
                </div>
                <p className="text-gray-600 mb-4">{course.desc}</p>
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaClock /> {course.duration}
                  </span>
                  <span>{course.level}</span>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Skills You'll Learn:</p>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill, skillIdx) => (
                      <span
                        key={skillIdx}
                        className="px-3 py-1 bg-[#4A3728]/10 text-[#4A3728] rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href="/login"
                  className="text-[#4A3728] font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  Enroll Now <FaArrowRight />
                </Link>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Create an account to access personalized career guidance and internship opportunities
            </p>
            <Link
              href="/login"
              className="btn-primary bg-white text-[#4A3728] hover:bg-gray-100 text-lg px-8 py-4 inline-flex items-center gap-2"
            >
              Login to Get Started <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;
