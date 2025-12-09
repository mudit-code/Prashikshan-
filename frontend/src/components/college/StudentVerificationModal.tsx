import React, { useState } from 'react';
import { FaTimes, FaCheck, FaUserTimes, FaExclamationTriangle, FaIdCard, FaSpinner } from 'react-icons/fa';
import { collegeAPI } from '../../lib/api';

interface StudentVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
    onSuccess: () => void;
}

const StudentVerificationModal: React.FC<StudentVerificationModalProps> = ({ isOpen, onClose, student, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);

    if (!isOpen || !student) return null;

    // Extract ID Card URL from profile data
    const idCardUrl = student.profile_data?.idCardUrl
        ? `http://localhost:5000${student.profile_data.idCardUrl}`
        : null;

    const handleMatchAndApprove = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await collegeAPI.verifyMatch(student.id);
            if (res.match) {
                setSuccessMsg(res.message);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            } else {
                setError(res.message || "Match failed. No corresponding record found.");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || "Verification failed due to server error.");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            await collegeAPI.approveStudent(student.id, 'Rejected');
            // Show success or close
            onSuccess();
            onClose();
        } catch (err: any) {
            setError("Failed to reject student.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">

                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                                Verify Student Request
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 transition-colors"
                                type="button"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* ID Card Preview */}
                            <div className="flex flex-col gap-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <FaIdCard /> Submitted ID Card
                                </h4>
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                                    {idCardUrl ? (
                                        <img
                                            src={idCardUrl}
                                            alt="Student ID"
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <p className="text-gray-400 text-sm">No ID Card Uploaded</p>
                                    )}
                                </div>
                            </div>

                            {/* Student Details */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-gray-700">Submitted Details</h4>
                                <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2 border border-gray-200">
                                    <p><span className="font-medium text-gray-600">Name:</span> {student.firstName} {student.lastName}</p>
                                    <p><span className="font-medium text-gray-600">Roll No:</span> {student.rollNo || student.profile_data?.rollNo || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-600">Email:</span> {student.user?.email}</p>
                                    <p><span className="font-medium text-gray-600">Course:</span> {student.profile_data?.course || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-600">Branch:</span> {student.profile_data?.branch || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-600">Year:</span> {student.profile_data?.year || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Messages */}
                        {error && (
                            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 flex items-center">
                                <FaExclamationTriangle className="text-red-500 mr-2" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {successMsg && (
                            <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 flex items-center">
                                <FaCheck className="text-green-500 mr-2" />
                                <p className="text-sm text-green-700">{successMsg}</p>
                            </div>
                        )}

                        {/* Reject Confirmation Overlay (Optional simple toggle) */}
                        {showRejectConfirm && !successMsg && (
                            <div className="mt-4 bg-red-50 p-4 rounded-lg border border-red-200">
                                <p className="text-red-800 font-medium mb-3">Are you sure you want to reject this student?</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleReject}
                                        disabled={loading}
                                        className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
                                    >
                                        {loading ? 'Rejecting...' : 'Yes, Reject Student'}
                                    </button>
                                    <button
                                        onClick={() => setShowRejectConfirm(false)}
                                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Footer Actions */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                        {!showRejectConfirm && !successMsg && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleMatchAndApprove}
                                    disabled={loading}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                >
                                    {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaCheck className="mr-2" />}
                                    Match & Approve
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowRejectConfirm(true)}
                                    disabled={loading}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    <FaUserTimes className="mr-2" /> Reject
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </>
                        )}

                        {(successMsg || showRejectConfirm) && successMsg && (
                            <button
                                onClick={onClose}
                                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-sm"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentVerificationModal;
