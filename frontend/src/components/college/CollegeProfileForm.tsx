import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/api';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaUniversity, FaMapMarkerAlt, FaFileContract, FaArrowRight, FaArrowLeft, FaCheckCircle, FaSpinner } from 'react-icons/fa';

interface CollegeProfileFormData {
    firstName: string;
    middleName?: string;
    lastName: string;
    designation: string;
    department: string;
    officialEmail: string;
    mobileNumber: string;
    alternateMobileNumber?: string;
    gender: string;

    collegeName: string;
    collegeCode: string;
    university: string;
    collegeType: string;
    websiteUrl?: string;
    collegeEmail?: string;
    yearOfEstablishment?: string;

    campusAddress: string;
    city: string;
    district: string;
    state: string;
    pinCode: string;
}

interface CollegeProfileFormProps {
    onSkip?: () => void;
    onSuccess?: () => void;
}

const CollegeProfileForm: React.FC<CollegeProfileFormProps> = ({ onSkip, onSuccess }) => {
    const { register, handleSubmit, setValue, trigger, formState: { errors } } = useForm<CollegeProfileFormData>();
    const [loading, setLoading] = useState(false);
    const [idProof, setIdProof] = useState<File | null>(null);
    const [authLetter, setAuthLetter] = useState<File | null>(null);
    const router = useRouter();
    const [initialData, setInitialData] = useState<any>(null);
    const [step, setStep] = useState(1);
    const [viewMode, setViewMode] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/api/college/profile');
                if (data) {
                    setInitialData(data);
                    // Pre-fill form
                    Object.keys(data).forEach(key => {
                        if (key !== 'idProofUrl' && key !== 'authLetterUrl') {
                            setValue(key as any, data[key]);
                        }
                    });
                    // Also pre-fill email and college name from user object if available
                    if (data.user) {
                        setValue('officialEmail', data.user.email);
                        setValue('collegeName', data.user.collegeName);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();
    }, [setValue]);

    const onSubmit = async (data: CollegeProfileFormData) => {
        setLoading(true);
        const formData = new FormData();

        // Append all text fields
        Object.keys(data).forEach(key => {
            if (data[key as keyof CollegeProfileFormData] !== undefined && data[key as keyof CollegeProfileFormData] !== null) {
                formData.append(key, data[key as keyof CollegeProfileFormData] as string);
            }
        });

        // Append files
        if (idProof) formData.append('idProof', idProof);
        if (authLetter) formData.append('authLetter', authLetter);

        formData.append('isCompleted', 'true');

        try {
            await api.put('/api/college/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Profile updated successfully!');
            setViewMode(true);
            onSuccess?.();
            // router.reload(); // Removed reload to keep modal open
        } catch (error: any) {
            console.error('Profile update error:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile';
            alert(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        let fieldsToValidate: (keyof CollegeProfileFormData)[] = [];
        if (step === 1) {
            fieldsToValidate = ['firstName', 'lastName', 'designation', 'department', 'mobileNumber', 'gender'];
        } else if (step === 2) {
            fieldsToValidate = ['collegeName', 'collegeCode', 'university', 'collegeType'];
        } else if (step === 3) {
            fieldsToValidate = ['campusAddress', 'city', 'district', 'state', 'pinCode'];
        }

        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            setStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        setStep(prev => prev - 1);
    };

    const renderStep1 = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><FaUser className="text-indigo-600" /> Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name *</label>
                    <input {...register('firstName', { required: true })} className="input-field" placeholder="First Name" />
                    {errors.firstName && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                    <input {...register('middleName')} className="input-field" placeholder="Middle Name" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                    <input {...register('lastName', { required: true })} className="input-field" placeholder="Last Name" />
                    {errors.lastName && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Designation *</label>
                    <select {...register('designation', { required: true })} className="input-field">
                        <option value="">Select Designation</option>
                        <option value="TPO">TPO</option>
                        <option value="Dean">Dean</option>
                        <option value="HOD">HOD</option>
                        <option value="Professor">Professor</option>
                        <option value="Coordinator">Coordinator</option>
                    </select>
                    {errors.designation && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Department *</label>
                    <input {...register('department', { required: true })} className="input-field" placeholder="Department" />
                    {errors.department && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Official Email</label>
                    <input {...register('officialEmail')} readOnly className="input-field bg-gray-100 cursor-not-allowed" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
                    <input {...register('mobileNumber', { required: true })} className="input-field" placeholder="Mobile Number" />
                    {errors.mobileNumber && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Alternate Mobile</label>
                    <input {...register('alternateMobileNumber')} className="input-field" placeholder="Alternate Mobile" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender *</label>
                    <select {...register('gender', { required: true })} className="input-field">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="text-red-500 text-xs">Required</span>}
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><FaUniversity className="text-indigo-600" /> College Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">College Name *</label>
                    <input {...register('collegeName', { required: true })} className="input-field" placeholder="College Name" />
                    {errors.collegeName && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">College Code *</label>
                    <input {...register('collegeCode', { required: true })} className="input-field" placeholder="College Code" />
                    {errors.collegeCode && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">University / Affiliation *</label>
                    <input {...register('university', { required: true })} className="input-field" placeholder="University" />
                    {errors.university && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">College Type *</label>
                    <select {...register('collegeType', { required: true })} className="input-field">
                        <option value="">Select Type</option>
                        <option value="Government">Government</option>
                        <option value="Private">Private</option>
                        <option value="Autonomous">Autonomous</option>
                        <option value="Deemed">Deemed</option>
                    </select>
                    {errors.collegeType && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">College Website URL</label>
                    <input {...register('websiteUrl')} className="input-field" placeholder="Website URL" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">College Email</label>
                    <input {...register('collegeEmail')} className="input-field" placeholder="College Email" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Year of Establishment</label>
                    <input {...register('yearOfEstablishment')} className="input-field" placeholder="Year" />
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><FaMapMarkerAlt className="text-indigo-600" /> Address Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Campus Address *</label>
                    <textarea {...register('campusAddress', { required: true })} rows={3} className="input-field" placeholder="Full Address" />
                    {errors.campusAddress && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">City *</label>
                    <input {...register('city', { required: true })} className="input-field" placeholder="City" />
                    {errors.city && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">District *</label>
                    <input {...register('district', { required: true })} className="input-field" placeholder="District" />
                    {errors.district && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">State *</label>
                    <input {...register('state', { required: true })} className="input-field" placeholder="State" />
                    {errors.state && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">PIN Code *</label>
                    <input {...register('pinCode', { required: true })} className="input-field" placeholder="PIN Code" />
                    {errors.pinCode && <span className="text-red-500 text-xs">Required</span>}
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><FaFileContract className="text-indigo-600" /> Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                    <p className="mb-2 font-medium">ID Proof Upload</p>
                    <p className="text-xs text-gray-500 mb-4">Faculty ID / Govt ID (&lt;100KB)</p>
                    <input type="file" onChange={(e) => setIdProof(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    {initialData?.idProofUrl && <p className="text-xs text-green-600 mt-2">Current: <a href={`http://localhost:5000${initialData.idProofUrl}`} target="_blank" rel="noreferrer" className="underline">View</a></p>}
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                    <p className="mb-2 font-medium">Authorization Letter</p>
                    <p className="text-xs text-gray-500 mb-4">Stamp + Principal Sign (&lt;200KB)</p>
                    <input type="file" onChange={(e) => setAuthLetter(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    {initialData?.authLetterUrl && <p className="text-xs text-green-600 mt-2">Current: <a href={`http://localhost:5000${initialData.authLetterUrl}`} target="_blank" rel="noreferrer" className="underline">View</a></p>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex flex-col max-w-7xl mx-auto relative"
            >
                {/* Header */}
                <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4 bg-white shrink-0 relative">
                    <button onClick={onSkip} className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 font-medium text-sm">Skip for now</button>

                    <div className="mb-4 mt-8">
                        <div className="flex items-center justify-between mb-4">
                            {[1, 2, 3, 4].map((s) => (
                                <div key={s} className={`flex flex-col items-center ${s <= step ? 'text-indigo-600' : 'text-gray-400'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${s <= step ? 'bg-indigo-100 font-bold text-lg' : 'bg-gray-100'}`}>
                                        {s < step ? <FaCheckCircle /> : s}
                                    </div>
                                    <span className="text-sm font-medium hidden md:block">
                                        {s === 1 ? 'Personal' : s === 2 ? 'College' : s === 3 ? 'Address' : 'Verification'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                            <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
                        </div>

                        {viewMode && (
                            <div className="flex justify-end mt-2">
                                <button onClick={() => setViewMode(false)} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1">
                                    <FaFileContract /> Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className={`flex-1 overflow-y-auto px-6 md:px-8 py-8 ${viewMode ? 'pointer-events-none opacity-90' : ''}`}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && renderStep3()}
                            {step === 4 && renderStep4()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-6 md:px-8 py-4 bg-gray-50 border-t shrink-0 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handlePrev}
                            disabled={step === 1}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${step === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            <FaArrowLeft /> Back
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Save & Next <FaArrowRight />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit(onSubmit)}
                                disabled={loading || viewMode}
                                className={`flex items-center gap-2 px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg shadow-green-200 ${viewMode ? 'hidden' : ''}`}
                            >
                                {loading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                                Complete Profile
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
            <style jsx global>{`
                .input-field {
                    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border;
                }
            `}</style>
        </div>
    );
};

export default CollegeProfileForm;
