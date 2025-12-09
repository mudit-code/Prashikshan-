import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBuilding, FaPhone, FaUserTie, FaFileContract, FaCheckCircle, FaSpinner, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { api } from '../../lib/api';

interface CompanyProfileFormProps {
    initialData?: any;
    onComplete: () => void;
    onSkip: () => void;
    user: any;
}

const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({ initialData, onComplete, onSkip, user }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1: Company Details
        companyName: '',
        legalName: '',
        cinRegistration: '',
        companyType: '',
        industrySector: '',
        yearOfIncorporation: '',
        companySize: '',

        // Step 2: Contact Details & Address
        contactNumber: '',
        alternatePhone: '',
        websiteUrl: '',
        linkedinUrl: '',
        headOfficeAddress: '',
        city: '',
        district: '',
        state: '',
        pinCode: '',
        country: 'India',

        // Step 3: HR Details
        recruiterFirstName: '',
        recruiterLastName: '',
        designation: '',
        workEmail: '',
        workContactNumber: '',

        // Step 4: Compliance (Files)
        registrationProof: null as File | null,
        authLetter: null as File | null,
        companyLogo: null as File | null,

        // Step 5: Hiring Preferences
        internshipTypes: [] as string[],
        stipendOffered: '',
        preferredSkills: [] as string[],
        hiringVolume: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                internshipTypes: initialData.internshipTypes ? initialData.internshipTypes.split(',') : [],
                preferredSkills: initialData.preferredSkills ? initialData.preferredSkills.split(',') : []
            }));
        } else if (user) {
            setFormData(prev => ({
                ...prev,
                companyName: user.companyName || '',
                workEmail: user.email || ''
            }));
        }
    }, [initialData, user]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (field: string, file: File | null) => {
        setFormData(prev => ({ ...prev, [field]: file }));
    };

    const handleMultiSelect = (field: 'internshipTypes' | 'preferredSkills', value: string) => {
        setFormData(prev => {
            const current = prev[field];
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...current, value] };
            }
        });
    };

    const handleSubmit = async (isCompleted: boolean = false) => {
        setLoading(true);
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'internshipTypes' || key === 'preferredSkills') {
                    data.append(key, (value as string[]).join(','));
                } else if (value instanceof File) {
                    data.append(key, value);
                } else if (value !== null && value !== undefined) {
                    data.append(key, value as string);
                }
            });

            data.append('isCompleted', String(isCompleted));

            await api.post('/api/company/profile', data);

            if (isCompleted) {
                onComplete();
            } else {
                // Just save progress
                // alert('Progress saved!'); // Optional feedback
            }
        } catch (error: any) {
            console.error('Error saving profile:', error);
            const status = error.response?.status;
            const data = error.response?.data;
            const msg = data?.error || data?.message || 'Failed to save profile.';
            alert(`Error ${status}: ${msg}\nDetails: ${JSON.stringify(data)}`);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        // Validate current step mandatory fields before moving next?
        // Or just save and move next? User requested "Save & Next".
        // Let's save progress then move next.
        await handleSubmit(false);
        setStep(prev => prev + 1);
    };

    const nextStep = () => handleNext();
    const prevStep = () => setStep(prev => prev - 1);

    const renderStep1 = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                    <input
                        type="text"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={e => handleInputChange('companyName', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registered Legal Name *</label>
                    <input
                        type="text"
                        placeholder="Registered Legal Name"
                        value={formData.legalName}
                        onChange={e => handleInputChange('legalName', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CIN / GST / Registration Number *</label>
                    <input
                        type="text"
                        placeholder="CIN / GST / Registration Number"
                        value={formData.cinRegistration}
                        onChange={e => handleInputChange('cinRegistration', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Type *</label>
                    <select
                        value={formData.companyType}
                        onChange={e => handleInputChange('companyType', e.target.value)}
                        className="input-field"
                    >
                        <option value="">Select Company Type</option>
                        <option value="Startup">Startup</option>
                        <option value="MSME">MSME</option>
                        <option value="MNC">MNC</option>
                        <option value="NGO">NGO</option>
                        <option value="Government">Government</option>
                        <option value="Consultancy">Consultancy</option>
                        <option value="Agency">Agency</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry Sector / Domain *</label>
                    <input
                        type="text"
                        placeholder="Industry Sector / Domain"
                        value={formData.industrySector}
                        onChange={e => handleInputChange('industrySector', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year of Incorporation *</label>
                    <input
                        type="number"
                        placeholder="Year of Incorporation"
                        value={formData.yearOfIncorporation}
                        onChange={e => handleInputChange('yearOfIncorporation', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Size *</label>
                    <select
                        value={formData.companySize}
                        onChange={e => handleInputChange('companySize', e.target.value)}
                        className="input-field"
                    >
                        <option value="">Select Company Size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="10-50">10-50 employees</option>
                        <option value="50-200">50-200 employees</option>
                        <option value="200+">200+ employees</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Contact & Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Official Email *</label>
                    <input
                        type="email"
                        placeholder="Official Email"
                        value={user.email} // Read-only from user login
                        readOnly
                        className="input-field bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                    <input
                        type="text"
                        placeholder="Contact Number"
                        value={formData.contactNumber}
                        onChange={e => handleInputChange('contactNumber', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                    <input
                        type="text"
                        placeholder="Alternate Phone (Optional)"
                        value={formData.alternatePhone}
                        onChange={e => handleInputChange('alternatePhone', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website URL *</label>
                    <input
                        type="url"
                        placeholder="Website URL"
                        value={formData.websiteUrl}
                        onChange={e => handleInputChange('websiteUrl', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Page</label>
                    <input
                        type="url"
                        placeholder="LinkedIn Page (Optional)"
                        value={formData.linkedinUrl}
                        onChange={e => handleInputChange('linkedinUrl', e.target.value)}
                        className="input-field"
                    />
                </div>
            </div>
            <h4 className="font-semibold mt-4">Head Office Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line *</label>
                    <input
                        type="text"
                        placeholder="Address Line"
                        value={formData.headOfficeAddress}
                        onChange={e => handleInputChange('headOfficeAddress', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={e => handleInputChange('city', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                    <input
                        type="text"
                        placeholder="District"
                        value={formData.district}
                        onChange={e => handleInputChange('district', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                        type="text"
                        placeholder="State"
                        value={formData.state}
                        onChange={e => handleInputChange('state', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                    <input
                        type="text"
                        placeholder="PIN Code"
                        value={formData.pinCode}
                        onChange={e => handleInputChange('pinCode', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <input
                        type="text"
                        placeholder="Country"
                        value={formData.country}
                        onChange={e => handleInputChange('country', e.target.value)}
                        className="input-field"
                    />
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">HR / Recruiter Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter First Name *</label>
                    <input
                        type="text"
                        placeholder="Recruiter First Name"
                        value={formData.recruiterFirstName}
                        onChange={e => handleInputChange('recruiterFirstName', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter Last Name *</label>
                    <input
                        type="text"
                        placeholder="Recruiter Last Name"
                        value={formData.recruiterLastName}
                        onChange={e => handleInputChange('recruiterLastName', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                    <input
                        type="text"
                        placeholder="Designation"
                        value={formData.designation}
                        onChange={e => handleInputChange('designation', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Email *</label>
                    <input
                        type="email"
                        placeholder="Work Email"
                        value={formData.workEmail}
                        onChange={e => handleInputChange('workEmail', e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Contact Number *</label>
                    <input
                        type="text"
                        placeholder="Work Contact Number"
                        value={formData.workContactNumber}
                        onChange={e => handleInputChange('workContactNumber', e.target.value)}
                        className="input-field"
                    />
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Compliance Documents</h3>
            <div className="grid grid-cols-1 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FaFileContract className="text-4xl text-gray-400 mx-auto mb-2" />
                    <p className="mb-2 font-medium">Company Registration Proof *</p>
                    <p className="text-xs text-gray-500 mb-4">Upload Certificate of Incorporation, GST, or PAN</p>
                    <input
                        type="file"
                        onChange={e => handleFileChange('registrationProof', e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FaUserTie className="text-4xl text-gray-400 mx-auto mb-2" />
                    <p className="mb-2 font-medium">Authorization Letter (Optional)</p>
                    <p className="text-xs text-gray-500 mb-4">If you are not a Director, upload authorization letter</p>
                    <input
                        type="file"
                        onChange={e => handleFileChange('authLetter', e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FaBuilding className="text-4xl text-gray-400 mx-auto mb-2" />
                    <p className="mb-2 font-medium">Company Logo (Optional)</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileChange('companyLogo', e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                </div>
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Hiring Preferences</h3>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Internship Types Offered</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Full-time', 'Part-time', 'Remote', 'Hybrid', 'On-site'].map(type => (
                            <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.internshipTypes.includes(type)}
                                    onChange={() => handleMultiSelect('internshipTypes', type)}
                                    className="rounded text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stipend Range Offered</label>
                    <select
                        value={formData.stipendOffered}
                        onChange={e => handleInputChange('stipendOffered', e.target.value)}
                        className="input-field"
                    >
                        <option value="">Select Stipend Range</option>
                        <option value="Unpaid">Unpaid</option>
                        <option value="2k-5k">₹2,000 - ₹5,000</option>
                        <option value="5k-10k">₹5,000 - ₹10,000</option>
                        <option value="10k-15k">₹10,000 - ₹15,000</option>
                        <option value="15k+">₹15,000+</option>
                        <option value="Negotiable">Negotiable</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Skills (Select all that apply)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'Design', 'Marketing', 'Sales', 'Content Writing'].map(skill => (
                            <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.preferredSkills.includes(skill)}
                                    onChange={() => handleMultiSelect('preferredSkills', skill)}
                                    className="rounded text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">{skill}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Hiring Volume (per year)</label>
                    <select
                        value={formData.hiringVolume}
                        onChange={e => handleInputChange('hiringVolume', e.target.value)}
                        className="input-field"
                    >
                        <option value="">Select Volume</option>
                        <option value="1-5">1-5 Interns</option>
                        <option value="5-20">5-20 Interns</option>
                        <option value="20-50">20-50 Interns</option>
                        <option value="50+">50+ Interns</option>
                    </select>
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
                            {[1, 2, 3, 4, 5].map((s) => (
                                <div key={s} className={`flex flex-col items-center ${s <= step ? 'text-primary-600' : 'text-gray-400'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${s <= step ? 'bg-primary-100 font-bold text-lg' : 'bg-gray-100'}`}>
                                        {s < step ? <FaCheckCircle /> : s}
                                    </div>
                                    <span className="text-sm font-medium hidden md:block">
                                        {s === 1 ? 'Company' : s === 2 ? 'Contact' : s === 3 ? 'HR Details' : s === 4 ? 'Documents' : 'Hiring'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                            <div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8">
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
                            {step === 5 && renderStep5()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-6 md:px-8 py-4 bg-gray-50 border-t shrink-0 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={prevStep}
                            disabled={step === 1}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${step === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            <FaArrowLeft /> Back
                        </button>

                        {step < 5 ? (
                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                            >
                                Save & Next <FaArrowRight />
                            </button>
                        ) : (
                            <button
                                onClick={() => handleSubmit(true)}
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg shadow-green-200"
                            >
                                {loading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                                Complete Profile
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                        * means mandatory. You can save progress with "Save & Next", but cannot complete profile without mandatory fields.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default CompanyProfileForm;
