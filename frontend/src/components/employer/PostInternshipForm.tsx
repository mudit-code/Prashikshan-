import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaCalendarAlt, FaUsers, FaSpinner } from 'react-icons/fa';
import { internshipsAPI } from '../../lib/api';

interface PostInternshipFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const PostInternshipForm: React.FC<PostInternshipFormProps> = ({ onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        workMode: 'On-site',
        location: '',
        internshipType: 'No',
        duration: '',
        stipendType: 'Paid',
        stipendAmount: '',
        skills: '',
        openings: 1,
        startDate: '',
        applicationDeadline: '',
        description: '',
        perks: '',
        eligibility: '',
        requirements: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await internshipsAPI.create(formData);
            alert('Internship posted successfully!');
            onSuccess();
        } catch (error: any) {
            console.error('Post internship error:', error);
            const errorMessage = error.response?.data?.error;
            if (Array.isArray(errorMessage)) {
                const messages = errorMessage.map((err: any) => `${err.path.join('.')}: ${err.message}`).join('\n');
                alert(`Validation failed:\n${messages}`);
            } else if (typeof errorMessage === 'object' && errorMessage !== null) {
                alert(`Error: ${JSON.stringify(errorMessage)}`);
            } else {
                alert(errorMessage || 'Failed to post internship');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaBriefcase className="text-primary-600" />
                    Post New Internship
                </h2>
                <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Core Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Internship Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. Backend Developer Intern"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
                        <select
                            name="workMode"
                            value={formData.workMode}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="On-site">On-site</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>
                </div>

                {/* Location & Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.workMode !== 'Remote' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location (City)</label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="e.g. Bangalore"
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PPO</label>
                        <select
                            name="internshipType"
                            value={formData.internshipType}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>

                {/* Duration & Stipend */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <div className="relative">
                            <FaClock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                name="duration"
                                required
                                value={formData.duration}
                                onChange={handleChange}
                                className="input-field pl-10"
                                placeholder="e.g. 3 months"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stipend Type</label>
                        <select
                            name="stipendType"
                            value={formData.stipendType}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Performance-based">Performance-based</option>
                        </select>
                    </div>
                    {formData.stipendType !== 'Unpaid' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount / Month</label>
                            <div className="relative">
                                <FaMoneyBillWave className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="stipendAmount"
                                    required
                                    value={formData.stipendAmount}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="e.g. 15000"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Dates & Openings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            required
                            value={formData.startDate}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Apply By</label>
                        <input
                            type="date"
                            name="applicationDeadline"
                            required
                            value={formData.applicationDeadline}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">No. of Openings</label>
                        <div className="relative">
                            <FaUsers className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="number"
                                name="openings"
                                min="1"
                                required
                                value={formData.openings}
                                onChange={handleChange}
                                className="input-field pl-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Detailed Info */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills (Comma separated)</label>
                        <input
                            type="text"
                            name="skills"
                            required
                            value={formData.skills}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. React, Node.js, TypeScript"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                        <textarea
                            name="description"
                            required
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Brief summary of the role and responsibilities..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                        <textarea
                            name="eligibility"
                            rows={2}
                            value={formData.eligibility}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. B.Tech CSE/IT, 3rd year students"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Other Requirements</label>
                        <textarea
                            name="requirements"
                            rows={2}
                            value={formData.requirements}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. Must have personal laptop, Good communication skills"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Perks (Optional)</label>
                        <input
                            type="text"
                            name="perks"
                            value={formData.perks}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. Certificate, Letter of Recommendation, Flexible hours"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary px-8 py-2 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Posting...
                            </>
                        ) : (
                            'Post Internship'
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default PostInternshipForm;
