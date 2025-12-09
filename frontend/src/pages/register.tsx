import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaRocket,
  FaBuilding,
  FaUniversity,
  FaGraduationCap,
  FaSpinner,
  FaBriefcase,
  FaArrowLeft
} from 'react-icons/fa';
import { authAPI, rolesAPI, collegeAPI } from '../lib/api';

const RegisterPage = () => {
  const router = useRouter();
  const { role } = router.query;

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: 1, // Default to Student
    accountType: 'college' as 'individual' | 'college', // For students only
    collegeName: '',
    collegeId: null as number | null,
    customCollegeName: '',
    aisheCode: '',
    collegeWebsite: '',
    companyName: '',
    companyWebsite: '',
    state: '',
    gstNumber: '', // Added GST Number
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [colleges, setColleges] = useState<any[]>([]);

  // Fetch colleges on mount
  React.useEffect(() => {
    const fetchColleges = async () => {
      try {
        const data = await collegeAPI.getList();
        setColleges(data);
      } catch (err) {
        console.error('Failed to fetch colleges:', err);
      }
    };
    fetchColleges();
  }, []);

  // Effect to set role from query param
  React.useEffect(() => {
    if (router.isReady) {
      if (!role) {
        // Redirect to select role if no role is provided
        router.replace('/select-role');
        return;
      }

      const roleStr = role as string;
      const foundRole = roles.find(r => r.id.toString() === roleStr || r.name.toLowerCase() === roleStr.toLowerCase());

      if (foundRole) {
        setFormData(prev => ({ ...prev, roleId: foundRole.id }));
      } else {
        // Fallback for invalid role
        router.replace('/select-role');
      }
    }
  }, [router.isReady, role]);

  const roles = [
    { id: 1, name: 'Student', label: 'Student', icon: FaGraduationCap },
    { id: 3, name: 'College Admin', label: 'College Admin', icon: FaUniversity },
    { id: 4, name: 'Employer', label: 'Employer', icon: FaBriefcase },
    { id: 5, name: 'State Admin', label: 'State Admin', icon: FaUniversity },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.roleId === 4) {
      if (!formData.companyName.trim()) {
        setError('Company Name is required');
        return;
      }
    }

    if (formData.roleId === 3) {
      if (!formData.collegeName.trim()) {
        setError('College Name is required');
        return;
      }
      if (!formData.aisheCode.trim() && !formData.collegeWebsite.trim()) {
        setError('Either AISHE Code or College Website is required');
        return;
      }
    }

    if (formData.roleId === 5) {
      if (!formData.state.trim()) {
        setError('State is required');
        return;
      }
    }

    setLoading(true);

    try {
      // const fullName = [formData.firstName, formData.middleName, formData.lastName]
      //   .filter(Boolean)
      //   .join(' ');

      // Use custom college name if "Other" was selected
      const finalCollegeName = formData.collegeName === 'Other'
        ? formData.customCollegeName
        : formData.collegeName;

      // For Individual accounts, set specific values
      const submissionData: any = {
        email: formData.email,
        password: formData.password,
        firstname: formData.firstName,
        middleName: formData.middleName,
        lastname: formData.lastName,
        roleId: formData.roleId,
        aisheCode: formData.aisheCode,
        collegeWebsite: formData.collegeWebsite,
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        state: formData.state,
      };

      // Set college data based on account type (only for students)
      if (formData.roleId === 1) {
        if (formData.accountType === 'individual') {
          submissionData.collegeName = 'Individual';
          submissionData.collegeId = 0;
        } else {
          submissionData.collegeName = finalCollegeName;
          submissionData.collegeId = formData.collegeId;
        }
      } else {
        submissionData.collegeName = finalCollegeName;
        submissionData.collegeId = formData.collegeId;
      }

      const response = await authAPI.register(submissionData);

      // Auto-login logic
      if (response && response.accessToken) {
        localStorage.setItem('token', response.accessToken);

        // Define dashboard paths
        let redirectPath = '/login-selection'; // Fallback

        switch (formData.roleId) {
          case 1: // Student
            redirectPath = '/student/dashboard';
            break;
          case 2: // Faculty
            redirectPath = '/faculty/dashboard';
            break;
          case 3: // College Admin
            redirectPath = '/college-admin/dashboard';
            break;
          case 4: // Employer
            redirectPath = '/employer/dashboard';
            break;
          case 5: // State Admin
            redirectPath = '/state-admin/dashboard';
            break;
        }

        alert('Registration successful! Logging you in...');
        router.push(redirectPath);
      } else {
        // Fallback if no token returned (should not happen with new backend)
        alert('Registration successful! Please verify your email before logging in.');
        router.push('/login-selection');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      let errorMessage = 'Registration failed. Please try again.';

      if (err.response) {
        // Server responded with a status code outside 2xx
        if (err.response.data && err.response.data.error) {
          if (typeof err.response.data.error === 'string') {
            errorMessage = err.response.data.error;
          } else if (Array.isArray(err.response.data.error)) {
            // Handle Zod array errors
            errorMessage = err.response.data.error.map((e: any) => e.message).join(', ');
          } else {
            errorMessage = JSON.stringify(err.response.data.error);
          }
        } else {
          errorMessage = `Server error: ${err.response.status}`;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request
        errorMessage = err.message;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#4A3728] rounded-full mb-4">
            <FaRocket className="text-4xl text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">
            Registering as <span className="font-bold text-[#4A3728]">{roles.find(r => r.id === formData.roleId)?.label}</span>
          </p>
          <button
            onClick={() => router.push('/select-role')}
            className="text-sm text-gray-500 hover:text-[#4A3728] mt-2 inline-flex items-center"
          >
            <FaArrowLeft className="mr-1" /> Change Role
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card"
        >
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection - HIDDEN, controlled via current page context */}
            <div className="hidden">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Register As
              </label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, roleId: r.id })}
                    className={`py-4 px-4 rounded-lg font-medium transition-all flex flex-col items-center gap-2 ${formData.roleId === r.id
                      ? 'bg-[#4A3728] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    <r.icon className="text-2xl" />
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name Fields */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input-field"
                    placeholder="First Name"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    className="input-field"
                    placeholder="Middle (Opt)"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input-field"
                    placeholder="Last Name"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* College Dropdown for Students */}
            {formData.roleId === 1 && (
              <div>
                <label htmlFor="studentCollege" className="block text-sm font-semibold text-gray-700 mb-2">
                  College Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUniversity className="text-gray-400" />
                  </div>
                  <select
                    id="studentCollege"
                    value={formData.collegeName}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      const selectedCollege = colleges.find(c => c.collegeName === selectedValue);
                      setFormData({
                        ...formData,
                        collegeName: selectedValue,
                        collegeId: selectedCollege ? selectedCollege.id : null,
                        customCollegeName: ''
                      });
                    }}
                    className="input-field pl-10"
                    required
                  >
                    <option value="">Select your college...</option>
                    {colleges.map((college) => (
                      <option key={college.id} value={college.collegeName}>
                        {college.collegeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* College/Company Name (optional for now) */}
            {formData.roleId === 3 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="collegeName" className="block text-sm font-semibold text-gray-700 mb-2">
                    College Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUniversity className="text-gray-400" />
                    </div>
                    <input
                      id="collegeName"
                      type="text"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      className="input-field pl-10"
                      placeholder="Your College Name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="aisheCode" className="block text-sm font-semibold text-gray-700 mb-2">
                    AISHE Code <span className="text-xs font-normal text-gray-500">(Required if no Website)</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Find your college AISHE code here in the <a href="https://dashboard.aishe.gov.in/hedirectory/#/hedirectory/universityDetails/C/ALL" target="_blank" rel="noopener noreferrer" className="text-[#4A3728] hover:underline">official portal</a>.
                  </p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUniversity className="text-gray-400" />
                    </div>
                    <input
                      id="aisheCode"
                      type="text"
                      value={formData.aisheCode}
                      onChange={(e) => setFormData({ ...formData, aisheCode: e.target.value })}
                      className="input-field pl-10"
                      placeholder="AISHE Code (e.g., C-12345)"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="collegeWebsite" className="block text-sm font-semibold text-gray-700 mb-2">
                    College Website <span className="text-xs font-normal text-gray-500">(Required if no AISHE Code)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUniversity className="text-gray-400" />
                    </div>
                    <input
                      id="collegeWebsite"
                      type="url"
                      value={formData.collegeWebsite}
                      onChange={(e) => setFormData({ ...formData, collegeWebsite: e.target.value })}
                      className="input-field pl-10"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.roleId === 4 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="text-gray-400" />
                    </div>
                    <input
                      id="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="input-field pl-10"
                      placeholder="Your Company Name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="companyWebsite" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Website <span className="text-xs font-normal text-gray-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBriefcase className="text-gray-400" />
                    </div>
                    <input
                      id="companyWebsite"
                      type="url"
                      value={formData.companyWebsite}
                      onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                      className="input-field pl-10"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                {/* GST Number Field */}
                <div>
                  <label htmlFor="gstNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                    GST Number
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Format example: 27ABCDE1234F2Z5
                  </p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBriefcase className="text-gray-400" />
                    </div>
                    <input
                      id="gstNumber"
                      type="text"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                      className="input-field pl-10 uppercase"
                      placeholder="27ABCDE1234F2Z5"
                      maxLength={15}
                    />
                  </div>
                </div>
              </div>

            )}

            {formData.roleId === 5 && (
              <div>
                <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                  State
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUniversity className="text-gray-400" />
                  </div>
                  <select
                    id="state"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="input-field pl-10"
                  >
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                    <option value="Lakshadweep">Lakshadweep</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Puducherry">Puducherry</option>
                    <option value="Ladakh">Ladakh</option>
                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                  </select>
                </div>
              </div>
            )}

            {formData.roleId === 2 && (
              <div>
                <label htmlFor="facultyCollegeName" className="block text-sm font-semibold text-gray-700 mb-2">
                  College Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBuilding className="text-gray-400" />
                  </div>
                  <input
                    id="facultyCollegeName"
                    type="text"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className="input-field pl-10"
                    placeholder="Your College Name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-10 pr-10"
                  placeholder="Create a password (min 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input-field pl-10 pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 rounded border-gray-300 text-[#4A3728] focus:ring-[#4A3728]"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/guest/rules" className="text-[#4A3728] hover:text-[#3E2723] font-medium">
                  Terms and Conditions
                </Link>
                {' '}and{' '}
                <Link href="#" className="text-[#4A3728] hover:text-[#3E2723] font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary bg-[#4A3728] hover:bg-[#3E2723] py-3 text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <Link
              href="/login-selection"
              className="text-[#4A3728] hover:text-[#3E2723] font-semibold"
            >
              Sign in instead →
            </Link>
          </div>
        </motion.div>
      </div>
    </div >
  );
};

export default RegisterPage;
