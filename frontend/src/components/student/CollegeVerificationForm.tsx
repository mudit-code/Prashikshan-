import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { studentAPI, collegeAPI } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUniversity, FaIdCard, FaFileUpload, FaTimes } from 'react-icons/fa';

interface CollegeVerificationFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface VerificationFormData {
    collegeId: string;
    rollNo: string;
    course: string;
    branch: string;
    year: string;
    section: string;
    collegeEmail: string;
}

const CollegeVerificationForm: React.FC<CollegeVerificationFormProps> = ({ isOpen, onClose, onSuccess }) => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<VerificationFormData>();
    const [colleges, setColleges] = useState<{ id: number; collegeName: string; aisheCode: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isCollegeLocked, setIsCollegeLocked] = useState(false);
    const [isEmailLocked, setIsEmailLocked] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const loadData = async () => {
                try {
                    setLoading(true);
                    const [collegesData, profileData] = await Promise.all([
                        collegeAPI.getList(),
                        studentAPI.getProfile()
                    ]);
                    setColleges(collegesData);

                    console.log("Profile Data:", profileData);
                    console.log("Colleges Data Length:", collegesData.length);

                    const defaultValues: any = {};

                    // Auto-fill email
                    if (profileData.email) {
                        defaultValues.collegeEmail = profileData.email;
                        setIsEmailLocked(true);
                    }

                    // Auto-fill college
                    let foundCollegeId = null;
                    if (profileData.collegeId) {
                        const found = collegesData.find((c: any) => c.id == profileData.collegeId);
                        if (found) foundCollegeId = found.id;
                    }

                    if (!foundCollegeId && profileData.collegeName) {
                        const found = collegesData.find((c: any) =>
                            c.collegeName.toLowerCase() === profileData.collegeName.toLowerCase()
                        );
                        if (found) foundCollegeId = found.id;
                    }

                    if (foundCollegeId) {
                        defaultValues.collegeId = String(foundCollegeId);
                        // We unlocked the field, but we still pre-fill it.
                    }

                    // Use reset to initialize form values robustly
                    // passing valid form keys only
                    if (Object.keys(defaultValues).length > 0) {
                        // maintain other fields empty
                        reset(defaultValues);
                        // Note: reset() might clear user input if they typed fast, 
                        // but this runs on mount/open.
                    }
                } catch (error) {
                    console.error('Failed to load initial data', error);
                } finally {
                    setLoading(false);
                }
            };
            loadData();
        }
    }, [isOpen, setValue]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const onSubmit = async (data: VerificationFormData) => {
        if (!file) {
            setSubmitError('Please upload your College ID Card');
            return;
        }
        setLoading(true);
        setSubmitError(null);

        try {
            const formData = new FormData();
            formData.append('collegeId', data.collegeId);
            formData.append('rollNo', data.rollNo);
            formData.append('course', data.course);
            formData.append('branch', data.branch);
            formData.append('year', data.year);
            formData.append('section', data.section);
            formData.append('collegeEmail', data.collegeEmail);
            formData.append('collegeIdCard', file);

            await studentAPI.linkCollege(formData);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Verification request failed', error);
            setSubmitError(error.response?.data?.error || 'Failed to submit verification request');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <FaUniversity /> College Verification
                        </h2>
                        <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                            <FaTimes />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                            <p className="text-sm text-blue-700">
                                Please provide accurate details. Your college admin will verify this information before approving your affiliation.
                            </p>
                        </div>

                        {submitError && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                                <p className="text-sm text-red-700">{submitError}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select College</label>
                                <select
                                    {...register('collegeId', { required: 'College is required' })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Select your college</option>
                                    {colleges.map((college) => (
                                        <option key={college.id} value={college.id}>
                                            {college.collegeName} {college.aisheCode ? `(${college.aisheCode})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.collegeId && <p className="text-red-500 text-xs mt-1">{errors.collegeId.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                                <input
                                    type="text"
                                    {...register('rollNo', { required: 'Roll Number is required' })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="e.g. 21BCS001"
                                />
                                {errors.rollNo && <p className="text-red-500 text-xs mt-1">{errors.rollNo.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                                <input
                                    type="text"
                                    {...register('course', { required: 'Course is required' })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="e.g. B.Tech"
                                />
                                {errors.course && <p className="text-red-500 text-xs mt-1">{errors.course.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                                <input
                                    type="text"
                                    {...register('branch', { required: 'Branch is required' })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="e.g. Computer Science"
                                />
                                {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <select
                                    {...register('year', { required: 'Year is required' })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Select Year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                                {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                                <input
                                    type="text"
                                    {...register('section', { required: 'Section is required' })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="e.g. A"
                                />
                                {errors.section && <p className="text-red-500 text-xs mt-1">{errors.section.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">College Email ID</label>
                                <input
                                    type="email"
                                    {...register('collegeEmail', { required: 'College Email is required' })}
                                    readOnly={isEmailLocked}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isEmailLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    placeholder="e.g. student@college.edu.in"
                                />
                                {errors.collegeEmail && <p className="text-red-500 text-xs mt-1">{errors.collegeEmail.message}</p>}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload College ID Card</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors cursor-pointer relative bg-gray-50">
                                    <div className="space-y-1 text-center">
                                        <FaIdCard className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="college-id-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                <span>Upload a file</span>
                                                <input id="college-id-upload" name="collegeIdCard" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,.pdf" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                                        {file && <p className="text-sm text-green-600 font-medium mt-2">Selected: {file.name}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? 'Submitting...' : 'Submit Verification Request'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CollegeVerificationForm;
