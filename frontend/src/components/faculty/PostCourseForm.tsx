import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaBook, FaClock, FaList, FaSave, FaSpinner } from 'react-icons/fa';
import { coursesAPI } from '../../lib/api';

interface PostCourseFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const PostCourseForm: React.FC<PostCourseFormProps> = ({ onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        duration: '',
        description: '',
        prerequisites: '',
        syllabus: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await coursesAPI.create(formData);
            onSuccess();
        } catch (error) {
            console.error('Failed to post course:', error);
            // Fallback for visual confirmation if API fails (since backend might be missing)
            // alert('Demo: Course published successfully (Backend integration pending)');
            // onSuccess();
            alert('Failed to publish course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FaBook className="text-primary-600" />
                    Publish New Course
                </h2>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FaTimes />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. Advanced Data Structures"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaClock className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="duration"
                                required
                                value={formData.duration}
                                onChange={handleChange}
                                className="input-field pl-10"
                                placeholder="e.g. 8 Weeks"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Detailed description of the course..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites</label>
                    <input
                        type="text"
                        name="prerequisites"
                        value={formData.prerequisites}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. Basic Java Programming"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus Outline</label>
                    <textarea
                        name="syllabus"
                        rows={3}
                        value={formData.syllabus}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Week 1: Intro... Week 2: Logic..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn-primary px-6 py-2 flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Publish Course
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default PostCourseForm;
