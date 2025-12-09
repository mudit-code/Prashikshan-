import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
console.log('API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const publicApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await publicApi.post('/auth/refresh');
        if (data.accessToken) {
          localStorage.setItem('token', data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    firstname: string;
    middleName: String;
    lastname: string;
    roleId: number;
    collegeName?: string;
    collegeId?: number | null;
    companyName?: string;
    aisheCode?: string;
    collegeWebsite?: string;
    companyWebsite?: string;
  }) => {
    const response = await publicApi.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await publicApi.post('/auth/login', data);
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  refresh: async () => {
    const response = await publicApi.post('/auth/refresh');
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await publicApi.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await publicApi.post('/auth/reset-password', { token, password });
    return response.data;
  },
};

// Internships API
export const internshipsAPI = {
  getAll: async () => {
    const response = await publicApi.get('/internships');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await publicApi.get(`/internships/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/internships', data);
    return response.data;
  },

  update: async (id: number, data: { title?: string; description?: string }) => {
    const response = await api.put(`/internships/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/internships/${id}`);
  },

  // Company specific
  getCompanyInternships: async () => {
    const response = await api.get('/api/company/internships');
    return response.data;
  },

  getInternshipApplications: async (internshipId: number) => {
    const response = await api.get(`/company/internships/${internshipId}/applications`);
    return response.data;
  },
};

// Applications API
export const applicationsAPI = {
  create: async (internshipId: number) => {
    const response = await api.post('/applications', { internshipId });
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/applications');
    return response.data;
  },

  updateStatus: async (applicationId: number, status: string) => {
    const response = await api.put(`/company/applications/${applicationId}`, { status });
    return response.data;
  },
};

// Logbooks API
export const logbooksAPI = {
  getAll: async () => {
    const response = await api.get('/logbooks');
    return response.data;
  },

  create: async (content: string, status: string = 'In Progress') => {
    const response = await api.post('/logbooks', { content, status });
    return response.data;
  },

  update: async (id: number, content: string, status: string) => {
    const response = await api.put(`/logbooks/${id}`, { content, status });
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/logbooks/${id}`);
  },

  export: async (id: number) => {
    const response = await api.get(`/logbooks/${id}/export`, { responseType: 'blob' });
    return response.data;
  },

  // Company specific
  getStudentLogbooks: async (studentId: number) => {
    const response = await api.get(`/api/company/logbooks/${studentId}`);
    return response.data;
  },
};

// Roles API (for registration)
export const rolesAPI = {
  getAll: async () => {
    // This would need to be added to backend, for now we'll use hardcoded values
    // Student: 1, Company: 2, Admin: 3 (based on typical seeding)
    return [
      { id: 1, name: 'Student' },
      { id: 2, name: 'Faculty' },
      { id: 3, name: 'Admin' },
      { id: 4, name: 'Employer' },
    ];
  },
};

export const studentAPI = {
  getProfile: async () => {
    const response = await api.get('/api/student/profile');
    return response.data;
  },
  updateProfile: async (data: FormData) => {
    const response = await api.post('/api/student/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  linkCollege: async (data: FormData) => {
    const response = await api.post('/api/student/link-college', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  getApplicationSummary: async (studentId: string) => {
    const response = await api.get(`/api/student/applications/summary/${studentId}`);
    return response.data;
  },
  getEligibleJobs: async (studentId: string) => {
    const response = await api.get(`/api/student/jobs/eligible/${studentId}`);
    return response.data;
  },
  getApplicationDetails: async (studentId: string) => {
    const response = await api.get(`/api/student/applications/details/${studentId}`);
    return response.data;
  },
};

export const collegeAPI = {
  getList: async () => {
    const response = await publicApi.get('/api/college/list');
    return response.data;
  },
  getPendingStudents: async () => {
    const response = await api.get('/api/college/pending-students');
    return response.data;
  },
  getApprovedStudents: async () => {
    const response = await api.get('/api/college/approved-students');
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await api.get('/api/college/stats');
    return response.data;
  },
  approveStudent: async (studentId: number, status: 'Approved' | 'Rejected') => {
    const response = await api.post(`/api/college/approve-student/${studentId}`, { status });
    return response.data;
  },
  verifyMatch: async (studentId: number) => {
    const response = await api.post(`/api/college/verify-match/${studentId}`);
    return response.data;
  },
};

export const coursesAPI = {
  getAll: async () => {
    const response = await publicApi.get('/courses');
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/courses', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/courses/${id}`);
  },

  getMyCourses: async () => {
    const response = await api.get('/faculty/courses');
    return response.data;
  },
};

export { api, publicApi };
