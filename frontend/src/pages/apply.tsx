import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import withAuth from '../components/withAuth';
import { FaBriefcase, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { applicationsAPI, internshipsAPI } from '../lib/api';

const ApplyPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [internship, setInternship] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchInternship();
    }
  }, [id]);

  const fetchInternship = async () => {
    try {
      const data = await internshipsAPI.getById(Number(id));
      setInternship(data);
    } catch (error) {
      console.error('Error fetching internship:', error);
    }
  };

  const handleApply = async () => {
    if (!id) return;
    
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await applicationsAPI.create(Number(id));
      setMessage('Successfully applied for the internship!');
      setTimeout(() => {
        router.push('/student/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to apply. You may have already applied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <FaBriefcase className="text-4xl text-primary-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Apply for Internship
          </h1>
          
          {internship && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{internship.title}</h3>
              <p className="text-gray-600">{internship.description}</p>
            </div>
          )}

          {id && (
            <p className="text-gray-600 mb-6">
              Internship ID: <span className="font-semibold text-primary-600">{id}</span>
            </p>
          )}

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Before you apply:</h3>
            <ul className="text-left space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                <span>Make sure your profile is complete and up-to-date</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                <span>Review the internship requirements carefully</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                <span>Ensure you meet the qualifications</span>
              </li>
            </ul>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <FaTimesCircle className="text-red-600 text-xl flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
            >
              <FaCheckCircle className="text-green-600 text-xl flex-shrink-0" />
              <p className="text-green-700">{message}</p>
            </motion.div>
          )}

          <button
            onClick={handleApply}
            disabled={loading || !!message || !id}
            className={`w-full btn-primary py-3 text-lg ${
              loading || message || !id ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" />
                Applying...
              </span>
            ) : message ? (
              <span className="flex items-center justify-center gap-2">
                <FaCheckCircle />
                Applied Successfully!
              </span>
            ) : (
              'Apply Now'
            )}
          </button>

          <button
            onClick={() => router.back()}
            className="mt-4 text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default withAuth(ApplyPage, ['Student']);
