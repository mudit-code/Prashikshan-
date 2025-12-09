import { api } from '../api';

export interface Application {
  id: number;
  internshipId: number;
  studentId: number;
  status: string;
  createdAt: string;
  internship?: {
    id: number;
    title: string;
    description: string;
  };
  student?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateApplicationData {
  internshipId: number;
}

export const applicationService = {
  async create(data: CreateApplicationData) {
    const response = await api.post<Application>('/applications', data);
    return response.data;
  },

  async getMyApplications() {
    const response = await api.get<Application[]>('/applications');
    return response.data;
  },

  // Company endpoints
  async updateApplicationStatus(applicationId: number, status: string) {
    const response = await api.put<Application>(`/company/applications/${applicationId}`, { status });
    return response.data;
  },
};

