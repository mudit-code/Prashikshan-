import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaList, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { collegeAPI } from '../../lib/api';

interface StudentRecord {
    id: number;
    email: string;
    student_name: string;
    roll_no: string;
    course: string;
    current_year: string;
    section: string;
    mobile_number: string;
}

const AdminStudentRegistration = () => {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [records, setRecords] = useState<StudentRecord[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        rollNo: '',
        course: '',
        year: '',
        section: ''
    });

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/college/student-records', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setRecords(data);
            } else {
                console.error("Failed to fetch records:", data.error);
            }
        } catch (error) {
            console.error("Error fetching records:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/college/student-record', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            // Handle non-200 responses separately
            if (!res.ok) {
                const text = await res.text();
                try {
                    const result = JSON.parse(text);
                    alert(result.error || `Request failed with status ${res.status}`);
                } catch (e) {
                    console.error("Non-JSON Response:", text);
                    alert(`Server Error: ${res.status} ${res.statusText}`);
                }
                setLoading(false);
                return;
            }

            const result = await res.json();
            alert('Student record added successfully!');
            setView('list');
            fetchRecords();
            setFormData({
                firstName: '', lastName: '', email: '', mobileNumber: '',
                rollNo: '', course: '', year: '', section: ''
            });
            setLoading(false);
        } catch (error) {
            console.error("Error adding student:", error);
            alert('An error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {view === 'list' ? 'Registered Students Record' : 'Add New Student Record'}
                </h2>
                {view === 'list' ? (
                    <button
                        onClick={() => setView('form')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <FaUserPlus /> Add Student
                    </button>
                ) : (
                    <button
                        onClick={() => setView('list')}
                        className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                    >
                        <FaArrowLeft /> Back to List
                    </button>
                )}
            </div>

            {view === 'list' ? (
                <div className="overflow-x-auto">
                    {loading && records.length === 0 ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year/Sec</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {records.length > 0 ? records.map((record) => (
                                    <tr key={record.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.roll_no}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.student_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.course}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.current_year} {record.section ? `(${record.section})` : ''}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No student records found. Click "Add Student" to create one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                            <input name="firstName" required className="w-full border rounded-lg px-3 py-2" value={formData.firstName} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                            <input name="lastName" required className="w-full border rounded-lg px-3 py-2" value={formData.lastName} onChange={handleInputChange} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input name="email" type="email" required className="w-full border rounded-lg px-3 py-2" value={formData.email} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number *</label>
                            <input name="rollNo" required className="w-full border rounded-lg px-3 py-2" value={formData.rollNo} onChange={handleInputChange} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                            <input name="course" required className="w-full border rounded-lg px-3 py-2" placeholder="e.g. B.Tech" value={formData.course} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <input name="mobileNumber" className="w-full border rounded-lg px-3 py-2" value={formData.mobileNumber} onChange={handleInputChange} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Year *</label>
                            <select name="year" required className="w-full border rounded-lg px-3 py-2" value={formData.year} onChange={handleInputChange}>
                                <option value="">Select Year</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                            <input name="section" className="w-full border rounded-lg px-3 py-2" placeholder="e.g. A" value={formData.section} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setView('list')} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                            {loading && <FaSpinner className="animate-spin" />}
                            Save Record
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AdminStudentRegistration;
