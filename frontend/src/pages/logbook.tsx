import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaBook,
  FaCalendar,
  FaClock,
  FaDownload,
  FaFileAlt,
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaChartLine
} from 'react-icons/fa';

const LogbookPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock logbook entries
  const entries = [
    {
      id: 1,
      date: '2024-01-20',
      hours: 8,
      activity: 'Developed user authentication module with JWT tokens',
      skills: ['React', 'Node.js', 'JWT'],
      status: 'approved',
    },
    {
      id: 2,
      date: '2024-01-19',
      hours: 7,
      activity: 'Implemented REST API endpoints for user management',
      skills: ['Node.js', 'Express', 'MongoDB'],
      status: 'approved',
    },
    {
      id: 3,
      date: '2024-01-18',
      hours: 8,
      activity: 'Created responsive UI components for dashboard',
      skills: ['React', 'CSS', 'Tailwind'],
      status: 'pending',
    },
  ];

  const stats = {
    totalHours: 120,
    totalEntries: 15,
    approvedEntries: 12,
    pendingEntries: 3,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Internship Logbook</h1>
              <p className="text-primary-100">Auto-generated logbook entries and reports</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                <FaDownload /> Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Hours', value: stats.totalHours, icon: FaClock, color: 'blue' },
            { label: 'Total Entries', value: stats.totalEntries, icon: FaBook, color: 'purple' },
            { label: 'Approved', value: stats.approvedEntries, icon: FaCheckCircle, color: 'green' },
            { label: 'Pending', value: stats.pendingEntries, icon: FaFileAlt, color: 'yellow' },
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

        {/* Actions */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Logbook Entries</h2>
              <p className="text-gray-600">
                Your activities are automatically tracked and logged. You can add manual entries if needed.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary">
                <FaPlus /> Add Entry
              </button>
              <button className="btn-secondary">
                <FaDownload /> Export
              </button>
            </div>
          </div>
        </div>

        {/* Entries List */}
        <div className="space-y-4">
          {entries.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="card"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendar className="text-primary-600" />
                      <span className="font-semibold">{entry.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaClock className="text-primary-600" />
                      <span>{entry.hours} hours</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        entry.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{entry.activity}</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.skills.map((skill, skillIdx) => (
                      <span
                        key={skillIdx}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {entry.status === 'pending' && (
                  <button className="btn-secondary">
                    <FaEdit /> Edit
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Report Generation */}
        <div className="card mt-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaChartLine className="text-2xl text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Generate Comprehensive Report</h3>
              <p className="text-gray-600 mb-4">
                Create a detailed report of all your internship activities, including hours worked, 
                skills developed, and achievements. This report can be used for college credit applications 
                and future job applications.
              </p>
              <div className="flex flex-wrap gap-2">
                <button className="btn-primary">
                  <FaDownload /> Generate PDF Report
                </button>
                <button className="btn-secondary">
                  <FaFileAlt /> Generate Word Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogbookPage;
