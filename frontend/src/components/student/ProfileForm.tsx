import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaGraduationCap, FaBriefcase, FaIdCard, FaCheck, FaArrowRight, FaArrowLeft, FaUpload, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { api, collegeAPI } from '../../lib/api';

interface ProfileFormProps {
    onComplete: () => void;
    onSkip: () => void;
    initialData?: any;
    user?: any;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onComplete, onSkip, initialData, user }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [colleges, setColleges] = useState<any[]>([]);
    const [formData, setFormData] = useState<any>({
        collegeId: '', // Add collegeId to root of formData
        personal: {
            firstName: '', middleName: '', lastName: '',
            fatherFirstName: '', fatherMiddleName: '', fatherLastName: '',
            motherFirstName: '', motherMiddleName: '', motherLastName: '',
            mobileNumber: '', gender: 'Male', dob: '',
            address: { houseNo: '', locality: '', city: '', district: '', state: '', pinCode: '' },
            govIdType: '', govIdOther: '', govIdNumber: ''
        },
        academic: {
            tenth: { level: '10th', rollNumber: '', yearOfPassing: '', boardName: '', schoolName: '', marksObtained: '', maximumMarks: '' },
            twelfth: { level: '12th', rollNumber: '', yearOfPassing: '', boardName: '', schoolName: '', marksObtained: '', maximumMarks: '' },
            graduation: { level: 'Graduation', collegeName: '', universityName: '', course: '', branch: '', rollNumber: '', yearOfAdmission: '', yearOfPassing: '', cgpaOrPercentage: '' },
            postGraduation: { level: 'Post-Graduation', collegeName: '', universityName: '', course: '', branch: '', rollNumber: '', yearOfAdmission: '', yearOfPassing: '', cgpaOrPercentage: '' },
            others: []
        },
        experience: {
            certifications: [],
            workExperience: [],
            extraCurricular: []
        },
        uploads: {
            photo: null,
            signature: null
        },
        social: {
            linkedin: '', github: '', portfolio: '', other: ''
        }
    });



    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const list = await collegeAPI.getList();
                setColleges(list);
            } catch (error) {
                console.error('Failed to fetch colleges', error);
            }
        };
        fetchColleges();
    }, []);

    useEffect(() => {
        if (initialData) {
            // Map initialData to formData structure
            const academicMap: any = {
                tenth: { level: '10th', rollNumber: '', yearOfPassing: '', boardName: '', schoolName: '', marksObtained: '', maximumMarks: '' },
                twelfth: { level: '12th', rollNumber: '', yearOfPassing: '', boardName: '', schoolName: '', marksObtained: '', maximumMarks: '' },
                graduation: { level: 'Graduation', collegeName: '', universityName: '', course: '', branch: '', rollNumber: '', yearOfAdmission: '', yearOfPassing: '', cgpaOrPercentage: '' },
                postGraduation: { level: 'Post-Graduation', collegeName: '', universityName: '', course: '', branch: '', rollNumber: '', yearOfAdmission: '', yearOfPassing: '', cgpaOrPercentage: '' },
                others: []
            };

            if (initialData.education && Array.isArray(initialData.education)) {
                initialData.education.forEach((edu: any) => {
                    if (edu.level === '10th') academicMap.tenth = { ...academicMap.tenth, ...edu };
                    else if (edu.level === '12th') academicMap.twelfth = { ...academicMap.twelfth, ...edu };
                    else if (edu.level === 'Graduation') academicMap.graduation = { ...academicMap.graduation, ...edu };
                    else if (edu.level === 'Post-Graduation') academicMap.postGraduation = { ...academicMap.postGraduation, ...edu };
                    else academicMap.others.push(edu);
                });
            }

            setFormData({
                personal: {
                    firstName: initialData.firstName || '',
                    middleName: initialData.middleName || '',
                    lastName: initialData.lastName || '',
                    fatherFirstName: initialData.fatherFirstName || '',
                    fatherMiddleName: initialData.fatherMiddleName || '',
                    fatherLastName: initialData.fatherLastName || '',
                    motherFirstName: initialData.motherFirstName || '',
                    motherMiddleName: initialData.motherMiddleName || '',
                    motherLastName: initialData.motherLastName || '',
                    mobileNumber: initialData.mobileNumber || '',
                    gender: initialData.gender || 'Male',
                    dob: initialData.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '',
                    address: initialData.address || { houseNo: '', locality: '', city: '', district: '', state: '', pinCode: '' },
                    govIdType: initialData.govIdType || '',
                    govIdOther: initialData.govIdOther || '',
                    govIdNumber: initialData.govIdNumber || ''
                },
                academic: academicMap,
                experience: {
                    certifications: initialData.certifications || [],
                    workExperience: initialData.workExperience || [],
                    extraCurricular: initialData.extraCurricular || []
                },
                uploads: {
                    photo: null, // Files cannot be pre-populated easily, user has to re-upload if changing
                    signature: null
                },
                social: initialData.socialLinks || { linkedin: '', github: '', portfolio: '', other: '' }
            });
        }

        if (user && user.name) {
            // Always enforce name from user object, overriding initialData if present
            const nameParts = user.name.split(' ');
            let firstName = '';
            let middleName = '';
            let lastName = '';

            if (nameParts.length === 1) {
                firstName = nameParts[0];
            } else if (nameParts.length === 2) {
                firstName = nameParts[0];
                lastName = nameParts[1];
            } else {
                firstName = nameParts[0];
                lastName = nameParts[nameParts.length - 1];
                middleName = nameParts.slice(1, -1).join(' ');
            }

            setFormData((prev: any) => ({
                ...prev,
                personal: {
                    ...prev.personal,
                    firstName,
                    middleName,
                    lastName
                }
            }));
        }
    }, [initialData, user]);

    const handleInputChange = (section: string, field: string, value: any, subSection?: string) => {
        if (subSection) {
            setFormData((prev: any) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [subSection]: { ...prev[section][subSection], [field]: value }
                }
            }));
        } else {
            setFormData((prev: any) => ({
                ...prev,
                [section]: { ...prev[section], [field]: value }
            }));
        }
    };

    const handleFileChange = (section: string, field: string, file: File | null, index?: number, subField?: string) => {
        if (section === 'uploads') {
            setFormData((prev: any) => ({
                ...prev,
                uploads: { ...prev.uploads, [field]: file }
            }));
        } else if (section === 'academic') {
            if (field === 'others' && index !== undefined) {
                const newOthers = [...formData.academic.others];
                newOthers[index] = { ...newOthers[index], marksheet: file };
                setFormData((prev: any) => ({ ...prev, academic: { ...prev.academic, others: newOthers } }));
            } else {
                setFormData((prev: any) => ({
                    ...prev,
                    academic: {
                        ...prev.academic,
                        [field]: { ...prev.academic[field], marksheet: file }
                    }
                }));
            }
        } else if (section === 'experience') {
            if (field === 'certifications' && index !== undefined && subField) {
                const newCerts = [...formData.experience.certifications];
                newCerts[index] = { ...newCerts[index], [subField]: file };
                setFormData((prev: any) => ({ ...prev, experience: { ...prev.experience, certifications: newCerts } }));
            } else if (field === 'workExperience' && index !== undefined && subField) {
                const newExp = [...formData.experience.workExperience];
                newExp[index] = { ...newExp[index], [subField]: file };
                setFormData((prev: any) => ({ ...prev, experience: { ...prev.experience, workExperience: newExp } }));
            }
        }
    };

    const addCertification = () => {
        setFormData((prev: any) => ({
            ...prev,
            experience: {
                ...prev.experience,
                certifications: [...prev.experience.certifications, { title: '', issuedBy: '', issuedOn: '', description: '', certificateLink: '' }]
            }
        }));
    };

    const addWorkExperience = () => {
        setFormData((prev: any) => ({
            ...prev,
            experience: {
                ...prev.experience,
                workExperience: [...prev.experience.workExperience, { role: '', company: '', startDate: '', endDate: '', isCurrent: false, description: '' }]
            }
        }));
    };

    const addExtraCurricular = () => {
        setFormData((prev: any) => ({
            ...prev,
            experience: {
                ...prev.experience,
                extraCurricular: [...(prev.experience.extraCurricular || []), { activity: '', description: '', date: '' }]
            }
        }));
    };

    const addOtherEducation = () => {
        setFormData((prev: any) => ({
            ...prev,
            academic: {
                ...prev.academic,
                others: [...prev.academic.others, { level: 'Other', collegeName: '', universityName: '', course: '', branch: '', rollNumber: '', yearOfAdmission: '', yearOfPassing: '', cgpaOrPercentage: '' }]
            }
        }));
    };

    const handleSubmit = async (isCompleted: boolean = false) => {
        setLoading(true);
        try {
            const data = new FormData();

            // Personal
            Object.keys(formData.personal).forEach(key => {
                if (key === 'address') {
                    data.append('address', JSON.stringify(formData.personal.address));
                } else if (['govIdType', 'govIdOther', 'govIdNumber'].includes(key)) {
                    data.append(key, formData.personal[key]);
                } else {
                    data.append(key, formData.personal[key]);
                }
            });

            // Academic (Flatten and append)
            const education = [
                formData.academic.tenth,
                formData.academic.twelfth,
                formData.academic.graduation,
                formData.academic.postGraduation,
                ...formData.academic.others
            ].filter(e => e.rollNumber || e.collegeName); // Simple filter to check if filled

            data.append('education', JSON.stringify(education.map(({ marksheet, ...rest }) => rest)));

            // Append academic files
            if (formData.academic.tenth.marksheet) data.append('education_0_marksheet', formData.academic.tenth.marksheet);
            if (formData.academic.twelfth.marksheet) data.append('education_1_marksheet', formData.academic.twelfth.marksheet);
            if (formData.academic.graduation.marksheet) data.append('education_2_marksheet', formData.academic.graduation.marksheet);
            if (formData.academic.postGraduation.marksheet) data.append('education_3_marksheet', formData.academic.postGraduation.marksheet);
            formData.academic.others.forEach((edu: any, index: number) => {
                if (edu.marksheet) data.append(`education_${index + 4}_marksheet`, edu.marksheet);
            });

            // Experience
            data.append('certifications', JSON.stringify(formData.experience.certifications.map(({ certificate, ...rest }: any) => rest)));
            formData.experience.certifications.forEach((cert: any, index: number) => {
                if (cert.certificate) data.append(`certification_${index}_certificate`, cert.certificate);
            });

            data.append('workExperience', JSON.stringify(formData.experience.workExperience.map(({ experienceLetter, ...rest }: any) => rest)));
            formData.experience.workExperience.forEach((exp: any, index: number) => {
                if (exp.experienceLetter) data.append(`experience_${index}_letter`, exp.experienceLetter);
            });

            data.append('extraCurricular', JSON.stringify(formData.experience.extraCurricular || []));
            // Social
            data.append('socialLinks', JSON.stringify(formData.social));

            // Uploads
            if (formData.uploads.photo) data.append('photo', formData.uploads.photo);
            if (formData.uploads.signature) data.append('signature', formData.uploads.signature);

            if (formData.collegeId) data.append('collegeId', formData.collegeId);

            data.append('isCompleted', String(isCompleted));

            await api.post('/api/student/profile', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (isCompleted) {
                onComplete();
            } else {
                // Just save progress
                // alert('Progress saved!');
            }
        } catch (error: any) {
            console.error('Error submitting profile:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to save profile. Please try again.';
            alert(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const validateStep = (currentStep: number) => {
        // Validation for new Step 1 (Experience) - optional mostly, so returning true
        if (currentStep === 1) {
            return true;
        }
        return true;
    };

    const handleNext = async () => {
        if (!validateStep(step)) return;

        if (step === 2) {
            await handleSubmit(true);
        } else {
            await handleSubmit(false);
            setStep(s => Math.min(2, s + 1));
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                        type="text"
                        placeholder="First Name"
                        className="input-field bg-gray-100 cursor-not-allowed"
                        value={formData.personal.firstName}
                        readOnly
                        title="Name cannot be changed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                    <input
                        type="text"
                        placeholder="Middle Name"
                        className="input-field bg-gray-100 cursor-not-allowed"
                        value={formData.personal.middleName}
                        readOnly
                        title="Name cannot be changed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="input-field bg-gray-100 cursor-not-allowed"
                        value={formData.personal.lastName}
                        readOnly
                        title="Name cannot be changed"
                    />
                </div>
            </div>

            <h4 className="font-semibold">Father's Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input type="text" placeholder="First Name" className="input-field" value={formData.personal.fatherFirstName} onChange={(e) => handleInputChange('personal', 'fatherFirstName', e.target.value)} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                    <input type="text" placeholder="Middle Name" className="input-field" value={formData.personal.fatherMiddleName} onChange={(e) => handleInputChange('personal', 'fatherMiddleName', e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input type="text" placeholder="Last Name" className="input-field" value={formData.personal.fatherLastName} onChange={(e) => handleInputChange('personal', 'fatherLastName', e.target.value)} required />
                </div>
            </div>

            <h4 className="font-semibold">Mother's Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input type="text" placeholder="First Name" className="input-field" value={formData.personal.motherFirstName} onChange={(e) => handleInputChange('personal', 'motherFirstName', e.target.value)} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                    <input type="text" placeholder="Middle Name" className="input-field" value={formData.personal.motherMiddleName} onChange={(e) => handleInputChange('personal', 'motherMiddleName', e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input type="text" placeholder="Last Name" className="input-field" value={formData.personal.motherLastName} onChange={(e) => handleInputChange('personal', 'motherLastName', e.target.value)} required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                    <input type="text" placeholder="Mobile Number" className="input-field" value={formData.personal.mobileNumber} onChange={(e) => handleInputChange('personal', 'mobileNumber', e.target.value)} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                    <select className="input-field" value={formData.personal.gender} onChange={(e) => handleInputChange('personal', 'gender', e.target.value)} required>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                    <input type="date" className="input-field" value={formData.personal.dob} onChange={(e) => handleInputChange('personal', 'dob', e.target.value)} required />
                </div>
            </div>

            <h4 className="font-semibold">Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="House No. / Street" className="input-field" value={formData.personal.address.houseNo} onChange={(e) => handleInputChange('personal', 'houseNo', e.target.value, 'address')} />
                <input type="text" placeholder="Locality / Area" className="input-field" value={formData.personal.address.locality} onChange={(e) => handleInputChange('personal', 'locality', e.target.value, 'address')} />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input type="text" placeholder="City" className="input-field" value={formData.personal.address.city} onChange={(e) => handleInputChange('personal', 'city', e.target.value, 'address')} required />
                </div>
                <input type="text" placeholder="District" className="input-field" value={formData.personal.address.district} onChange={(e) => handleInputChange('personal', 'district', e.target.value, 'address')} />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input type="text" placeholder="State" className="input-field" value={formData.personal.address.state} onChange={(e) => handleInputChange('personal', 'state', e.target.value, 'address')} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                    <input type="text" placeholder="PIN Code" className="input-field" value={formData.personal.address.pinCode} onChange={(e) => handleInputChange('personal', 'pinCode', e.target.value, 'address')} required />
                </div>
            </div>


            <h4 className="font-semibold">Government ID</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select className="input-field" value={formData.personal.govIdType} onChange={(e) => handleInputChange('personal', 'govIdType', e.target.value)}>
                    <option value="">Select ID Type</option>
                    <option value="PAN">PAN Card</option>
                    <option value="DRIVING_LICENSE">Driving License</option>
                    <option value="AADHAR_CARD">Aadhar Card</option>
                    <option value="OTHER">Other</option>
                </select>
                {formData.personal.govIdType === 'OTHER' && (
                    <input type="text" placeholder="Specify ID Type" className="input-field" value={formData.personal.govIdOther} onChange={(e) => handleInputChange('personal', 'govIdOther', e.target.value)} />
                )}
                <input type="text" placeholder="ID Number" className="input-field" value={formData.personal.govIdNumber} onChange={(e) => handleInputChange('personal', 'govIdNumber', e.target.value)} />
            </div>

            <h4 className="font-semibold">College Selection</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Your College *</label>
                    <select
                        className="input-field"
                        value={formData.collegeId || ''}
                        onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                        required
                    >
                        <option value="">Select College</option>
                        {colleges.map((college: any) => (
                            <option key={college.id} value={college.id}>
                                {college.collegeName} {college.aisheCode ? `(${college.aisheCode})` : ''}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        Select the college you are currently enrolled in. This will send your profile for approval to the College Admin.
                    </p>
                </div>
            </div>
        </div >
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Academic Details</h3>

            {/* 10th */}
            <div className="border p-4 rounded-lg">
                <h4 className="font-semibold mb-2">10th (High School) *</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Roll Number *" className="input-field" value={formData.academic.tenth.rollNumber} onChange={(e) => handleInputChange('academic', 'rollNumber', e.target.value, 'tenth')} required />
                    <input type="text" placeholder="Year of Passing *" className="input-field" value={formData.academic.tenth.yearOfPassing} onChange={(e) => handleInputChange('academic', 'yearOfPassing', e.target.value, 'tenth')} required />
                    <input type="text" placeholder="Board Name *" className="input-field" value={formData.academic.tenth.boardName} onChange={(e) => handleInputChange('academic', 'boardName', e.target.value, 'tenth')} required />
                    <input type="text" placeholder="School Name" className="input-field" value={formData.academic.tenth.schoolName} onChange={(e) => handleInputChange('academic', 'schoolName', e.target.value, 'tenth')} />
                    <input type="number" placeholder="Marks Obtained *" className="input-field" value={formData.academic.tenth.marksObtained} onChange={(e) => handleInputChange('academic', 'marksObtained', e.target.value, 'tenth')} required />
                    <input type="number" placeholder="Maximum Marks *" className="input-field" value={formData.academic.tenth.maximumMarks} onChange={(e) => handleInputChange('academic', 'maximumMarks', e.target.value, 'tenth')} required />
                    <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Upload Marksheet</label>
                        <input type="file" className="input-field" onChange={(e) => handleFileChange('academic', 'tenth', e.target.files?.[0] || null)} />
                    </div>
                </div>
            </div>

            {/* 12th */}
            <div className="border p-4 rounded-lg">
                <h4 className="font-semibold mb-2">12th (Intermediate)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Roll Number" className="input-field" value={formData.academic.twelfth.rollNumber} onChange={(e) => handleInputChange('academic', 'rollNumber', e.target.value, 'twelfth')} />
                    <input type="text" placeholder="Year of Passing" className="input-field" value={formData.academic.twelfth.yearOfPassing} onChange={(e) => handleInputChange('academic', 'yearOfPassing', e.target.value, 'twelfth')} />
                    <input type="text" placeholder="Board Name" className="input-field" value={formData.academic.twelfth.boardName} onChange={(e) => handleInputChange('academic', 'boardName', e.target.value, 'twelfth')} />
                    <input type="text" placeholder="School Name" className="input-field" value={formData.academic.twelfth.schoolName} onChange={(e) => handleInputChange('academic', 'schoolName', e.target.value, 'twelfth')} />
                    <input type="number" placeholder="Marks Obtained" className="input-field" value={formData.academic.twelfth.marksObtained} onChange={(e) => handleInputChange('academic', 'marksObtained', e.target.value, 'twelfth')} />
                    <input type="number" placeholder="Maximum Marks" className="input-field" value={formData.academic.twelfth.maximumMarks} onChange={(e) => handleInputChange('academic', 'maximumMarks', e.target.value, 'twelfth')} />
                    <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Upload Marksheet</label>
                        <input type="file" className="input-field" onChange={(e) => handleFileChange('academic', 'twelfth', e.target.files?.[0] || null)} />
                    </div>
                </div>
            </div>

            {/* Graduation */}
            <div className="border p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Graduation</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="College Name" className="input-field" value={formData.academic.graduation.collegeName} onChange={(e) => handleInputChange('academic', 'collegeName', e.target.value, 'graduation')} />
                    <input type="text" placeholder="University Name" className="input-field" value={formData.academic.graduation.universityName} onChange={(e) => handleInputChange('academic', 'universityName', e.target.value, 'graduation')} />
                    <input type="text" placeholder="Course / Degree" className="input-field" value={formData.academic.graduation.course} onChange={(e) => handleInputChange('academic', 'course', e.target.value, 'graduation')} />
                    <input type="text" placeholder="Branch" className="input-field" value={formData.academic.graduation.branch} onChange={(e) => handleInputChange('academic', 'branch', e.target.value, 'graduation')} />
                    <input type="text" placeholder="Roll Number" className="input-field" value={formData.academic.graduation.rollNumber} onChange={(e) => handleInputChange('academic', 'rollNumber', e.target.value, 'graduation')} />
                    <input type="text" placeholder="Year of Admission" className="input-field" value={formData.academic.graduation.yearOfAdmission} onChange={(e) => handleInputChange('academic', 'yearOfAdmission', e.target.value, 'graduation')} />
                    <input type="text" placeholder="Year of Passing" className="input-field" value={formData.academic.graduation.yearOfPassing} onChange={(e) => handleInputChange('academic', 'yearOfPassing', e.target.value, 'graduation')} />
                    <input type="text" placeholder="CGPA / Percentage" className="input-field" value={formData.academic.graduation.cgpaOrPercentage} onChange={(e) => handleInputChange('academic', 'cgpaOrPercentage', e.target.value, 'graduation')} />
                    <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Upload Marksheet</label>
                        <input type="file" className="input-field" onChange={(e) => handleFileChange('academic', 'graduation', e.target.files?.[0] || null)} />
                        <p className="text-xs text-gray-500 mt-1">Max 2MB, JPG/PNG/PDF</p>
                    </div>
                </div>
            </div>

            {/* Post Graduation */}
            <div className="border p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Post Graduation</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="College Name" className="input-field" value={formData.academic.postGraduation.collegeName} onChange={(e) => handleInputChange('academic', 'collegeName', e.target.value, 'postGraduation')} />
                    <input type="text" placeholder="University Name" className="input-field" value={formData.academic.postGraduation.universityName} onChange={(e) => handleInputChange('academic', 'universityName', e.target.value, 'postGraduation')} />
                    <input type="text" placeholder="Course / Degree" className="input-field" value={formData.academic.postGraduation.course} onChange={(e) => handleInputChange('academic', 'course', e.target.value, 'postGraduation')} />
                    <input type="text" placeholder="Branch" className="input-field" value={formData.academic.postGraduation.branch} onChange={(e) => handleInputChange('academic', 'branch', e.target.value, 'postGraduation')} />
                    <input type="text" placeholder="Roll Number" className="input-field" value={formData.academic.postGraduation.rollNumber} onChange={(e) => handleInputChange('academic', 'rollNumber', e.target.value, 'postGraduation')} />
                    <input type="text" placeholder="Year of Admission" className="input-field" value={formData.academic.postGraduation.yearOfAdmission} onChange={(e) => handleInputChange('academic', 'yearOfAdmission', e.target.value, 'postGraduation')} />
                    <input type="text" placeholder="Year of Passing" className="input-field" value={formData.academic.postGraduation.yearOfPassing} onChange={(e) => handleInputChange('academic', 'yearOfPassing', e.target.value, 'postGraduation')} />
                    <input type="text" placeholder="CGPA / Percentage" className="input-field" value={formData.academic.postGraduation.cgpaOrPercentage} onChange={(e) => handleInputChange('academic', 'cgpaOrPercentage', e.target.value, 'postGraduation')} />
                    <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Upload Marksheet</label>
                        <input type="file" className="input-field" onChange={(e) => handleFileChange('academic', 'postGraduation', e.target.files?.[0] || null)} />
                        <p className="text-xs text-gray-500 mt-1">Max 2MB, JPG/PNG/PDF</p>
                    </div>
                </div>
            </div>

            {/* Other Education */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Other Qualifications</h4>
                    <button onClick={addOtherEducation} className="text-sm text-primary-600">+ Add More</button>
                </div>
                {formData.academic.others.map((edu: any, index: number) => (
                    <div key={index} className="border p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" placeholder="College / Institute" className="input-field" value={edu.collegeName} onChange={(e) => {
                                const newOthers = [...formData.academic.others];
                                newOthers[index].collegeName = e.target.value;
                                setFormData((prev: any) => ({ ...prev, academic: { ...prev.academic, others: newOthers } }));
                            }} />
                            <input type="text" placeholder="University / Board" className="input-field" value={edu.universityName} onChange={(e) => {
                                const newOthers = [...formData.academic.others];
                                newOthers[index].universityName = e.target.value;
                                setFormData((prev: any) => ({ ...prev, academic: { ...prev.academic, others: newOthers } }));
                            }} />
                            <input type="text" placeholder="Course / Degree" className="input-field" value={edu.course} onChange={(e) => {
                                const newOthers = [...formData.academic.others];
                                newOthers[index].course = e.target.value;
                                setFormData((prev: any) => ({ ...prev, academic: { ...prev.academic, others: newOthers } }));
                            }} />
                            <input type="text" placeholder="Branch / Specialization" className="input-field" value={edu.branch} onChange={(e) => {
                                const newOthers = [...formData.academic.others];
                                newOthers[index].branch = e.target.value;
                                setFormData((prev: any) => ({ ...prev, academic: { ...prev.academic, others: newOthers } }));
                            }} />
                            <input type="text" placeholder="Roll Number" className="input-field" value={edu.rollNumber} onChange={(e) => {
                                const newOthers = [...formData.academic.others];
                                newOthers[index].rollNumber = e.target.value;
                                setFormData((prev: any) => ({ ...prev, academic: { ...prev.academic, others: newOthers } }));
                            }} />
                            <input type="text" placeholder="Year of Passing" className="input-field" value={edu.yearOfPassing} onChange={(e) => {
                                const newOthers = [...formData.academic.others];
                                newOthers[index].yearOfPassing = e.target.value;
                                setFormData((prev: any) => ({ ...prev, academic: { ...prev.academic, others: newOthers } }));
                            }} />
                            <input type="text" placeholder="CGPA / Percentage" className="input-field" value={edu.cgpaOrPercentage} onChange={(e) => {
                                const newOthers = [...formData.academic.others];
                                newOthers[index].cgpaOrPercentage = e.target.value;
                                setFormData((prev: any) => ({ ...prev, academic: { ...prev.academic, others: newOthers } }));
                            }} />
                            <div className="col-span-3">
                                <label className="block text-sm font-medium text-gray-700">Upload Marksheet</label>
                                <input type="file" className="input-field" onChange={(e) => handleFileChange('academic', 'others', e.target.files?.[0] || null, index)} />
                                <p className="text-xs text-gray-500 mt-1">Max 2MB, JPG/PNG/PDF</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Skills & Experience</h3>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Certifications</h4>
                    <button onClick={addCertification} className="text-sm text-primary-600">+ Add Certification</button>
                </div>
                {formData.experience.certifications.map((cert: any, index: number) => (
                    <div key={index} className="border p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Certificate Title" className="input-field" value={cert.title} onChange={(e) => {
                                const newCerts = [...formData.experience.certifications];
                                newCerts[index].title = e.target.value;
                                setFormData((prev: any) => ({ ...prev, experience: { ...prev.experience, certifications: newCerts } }));
                            }} />
                            <input type="text" placeholder="Issued By" className="input-field" value={cert.issuedBy} onChange={(e) => {
                                const newCerts = [...formData.experience.certifications];
                                newCerts[index].issuedBy = e.target.value;
                                setFormData((prev: any) => ({ ...prev, experience: { ...prev.experience, certifications: newCerts } }));
                            }} />
                            <input type="date" className="input-field" value={cert.issuedOn} onChange={(e) => {
                                const newCerts = [...formData.experience.certifications];
                                newCerts[index].issuedOn = e.target.value;
                                setFormData((prev: any) => ({ ...prev, experience: { ...prev.experience, certifications: newCerts } }));
                            }} />
                            <input type="file" className="input-field" onChange={(e) => handleFileChange('experience', 'certifications', e.target.files?.[0] || null, index, 'certificate')} />
                            <input type="text" placeholder="Certificate Link (if available)" className="input-field col-span-1 md:col-span-2" value={cert.certificateLink || ''} onChange={(e) => {
                                const newCerts = [...formData.experience.certifications];
                                newCerts[index].certificateLink = e.target.value;
                                setFormData((prev: any) => ({ ...prev, experience: { ...prev.experience, certifications: newCerts } }));
                            }} />
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Work Experience</h4>
                    <button onClick={addWorkExperience} className="text-sm text-primary-600">+ Add Experience</button>
                </div>
                {formData.experience.workExperience.map((exp: any, index: number) => (
                    <div key={index} className="border p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Role" className="input-field" value={exp.role} onChange={(e) => {
                                const newExp = [...formData.experience.workExperience];
                                newExp[index].role = e.target.value;
                                setFormData((prev: any) => ({ ...prev, experience: { ...prev.experience, workExperience: newExp } }));
                            }} />
                            <input type="text" placeholder="Company" className="input-field" value={exp.company} onChange={(e) => {
                                const newExp = [...formData.experience.workExperience];
                                newExp[index].company = e.target.value;
                                setFormData((prev: any) => ({ ...prev, experience: { ...prev.experience, workExperience: newExp } }));
                            }} />
                            <input type="date" placeholder="Start Date" className="input-field" value={exp.startDate} onChange={(e) => {
                                const newExp = [...formData.experience.workExperience];
                                newExp[index].startDate = e.target.value;
                                setFormData((prev: any) => ({ ...prev, experience: { ...prev.experience, workExperience: newExp } }));
                            }} />
                            <input type="date" placeholder="End Date" className="input-field" value={exp.endDate} onChange={(e) => {
                                const newExp = [...formData.experience.workExperience];
                                newExp[index].endDate = e.target.value;
                                setFormData((prev: any) => ({ ...prev, experience: { ...prev.experience, workExperience: newExp } }));
                            }} />
                            <input type="file" className="input-field" onChange={(e) => handleFileChange('experience', 'workExperience', e.target.files?.[0] || null, index, 'experienceLetter')} />
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Extra Curricular Activities</h4>
                    <button onClick={addExtraCurricular} className="text-sm text-primary-600">+ Add Activity</button>
                </div>
                {formData.experience.extraCurricular?.map((activity: any, index: number) => (
                    <div key={index} className="border p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Activity Name" className="input-field" value={activity.activity} onChange={(e) => {
                                const newActivities = [...formData.experience.extraCurricular];
                                newActivities[index].activity = e.target.value;
                                setFormData((prev: any) => ({ ...prev, experience: { ...prev.experience, extraCurricular: newActivities } }));
                            }} />
                            <input type="date" placeholder="Date" className="input-field" value={activity.date} onChange={(e) => {
                                const newActivities = [...formData.experience.extraCurricular];
                                newActivities[index].date = e.target.value;
                                setFormData((prev: any) => ({ ...prev, experience: { ...prev.experience, extraCurricular: newActivities } }));
                            }} />
                            <textarea placeholder="Description" className="input-field col-span-1 md:col-span-2" rows={2} value={activity.description} onChange={(e) => {
                                const newActivities = [...formData.experience.extraCurricular];
                                newActivities[index].description = e.target.value;
                                setFormData((prev: any) => ({ ...prev, experience: { ...prev.experience, extraCurricular: newActivities } }));
                            }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Photo & Signature</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FaUser className="text-4xl text-gray-400 mx-auto mb-2" />
                    <p className="mb-2 font-medium">Upload Photo *</p>
                    <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileChange('uploads', 'photo', e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                    <p className="text-xs text-gray-500 mt-2">Max 2MB, JPG/PNG</p>
                    {formData.uploads.photo && (
                        <div className="mt-4">
                            <img src={URL.createObjectURL(formData.uploads.photo)} alt="Photo Preview" className="h-32 w-32 object-cover mx-auto rounded-full border" />
                        </div>
                    )}
                    {!formData.uploads.photo && initialData?.photoUrl && (
                        <div className="mt-4">
                            <img src={`http://localhost:5000${initialData.photoUrl}`} alt="Current Photo" className="h-32 w-32 object-cover mx-auto rounded-full border" />
                            <p className="text-xs text-green-600 mt-1">Current Photo</p>
                        </div>
                    )}
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FaIdCard className="text-4xl text-gray-400 mx-auto mb-2" />
                    <p className="mb-2 font-medium">Upload Signature *</p>
                    <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileChange('uploads', 'signature', e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                    <p className="text-xs text-gray-500 mt-2">Max 2MB, JPG/PNG</p>
                    {formData.uploads.signature && (
                        <div className="mt-4">
                            <img src={URL.createObjectURL(formData.uploads.signature)} alt="Signature Preview" className="h-20 w-auto object-contain mx-auto border p-2" />
                        </div>
                    )}
                    {!formData.uploads.signature && initialData?.signatureUrl && (
                        <div className="mt-4">
                            <img src={`http://localhost:5000${initialData.signatureUrl}`} alt="Current Signature" className="h-20 w-auto object-contain mx-auto border p-2" />
                            <p className="text-xs text-green-600 mt-1">Current Signature</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Digital Identity</h3>
            <div className="grid grid-cols-1 gap-4">
                <input type="text" placeholder="LinkedIn Profile URL" className="input-field" value={formData.social.linkedin} onChange={(e) => handleInputChange('social', 'linkedin', e.target.value)} />
                <input type="text" placeholder="GitHub Profile URL" className="input-field" value={formData.social.github} onChange={(e) => handleInputChange('social', 'github', e.target.value)} />
                <input type="text" placeholder="Portfolio URL" className="input-field" value={formData.social.portfolio} onChange={(e) => handleInputChange('social', 'portfolio', e.target.value)} />
                <input type="text" placeholder="Other Link" className="input-field" value={formData.social.other} onChange={(e) => handleInputChange('social', 'other', e.target.value)} />
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
                <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4 bg-white shrink-0 relative">
                    <button onClick={onSkip} className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 font-medium text-sm">Skip for now</button>

                    <div className="mb-4 mt-8">
                        <div className="flex items-center justify-between mb-4">
                            {[1, 2].map((s) => (
                                <div key={s} className={`flex flex-col items-center ${s <= step ? 'text-primary-600' : 'text-gray-400'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${s <= step ? 'bg-primary-100 font-bold text-lg' : 'bg-gray-100'}`}>
                                        {s < step ? <FaCheck /> : s}
                                    </div>
                                    <span className="text-sm font-medium hidden md:block">
                                        {s === 1 ? 'Skills & Exp.' : 'Social'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                            <div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(step / 2) * 100}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8">
                    <div className="mb-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {step === 1 && renderStep3()}
                                {step === 2 && renderStep5()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-between pb-8">
                        <button
                            onClick={() => setStep(s => Math.max(1, s - 1))}
                            disabled={step === 1}
                            className={`btn-secondary flex items-center gap-2 ${step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <FaArrowLeft /> Previous
                        </button>

                        {step < 5 ? (
                            <button onClick={handleNext} className="btn-primary flex items-center gap-2">
                                Save & Next <FaArrowRight />
                            </button>
                        ) : (
                            <button onClick={() => handleSubmit(true)} disabled={loading} className="btn-primary flex items-center gap-2">
                                {loading ? 'Saving...' : 'Complete Profile'} <FaCheck />
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

export default ProfileForm;
