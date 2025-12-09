import { api } from '../api';
import { Application } from './applications';

export interface Internship {
  id: number;
  title: string;
  description: string;
  postedById: number;
  createdAt: string;
  postedBy?: {
    id: number;
    name: string;
    email: string;
  };
  applications?: Application[];
}

export interface CreateInternshipData {
  title: string;
  description: string;
}

export interface UpdateInternshipData {
  title?: string;
  description?: string;
}

export const internshipService = {
  async getAll() {
    const response = await api.get<Internship[]>('/internships');
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get<Internship>(`/internships/${id}`);
    return response.data;
  },

  async create(data: CreateInternshipData) {
    const response = await api.post<Internship>('/internships', data);
    return response.data;
  },

  async update(id: number, data: UpdateInternshipData) {
    const response = await api.put<Internship>(`/internships/${id}`, data);
    return response.data;
  },

  async delete(id: number) {
    await api.delete(`/internships/${id}`);
  },

  // Company-specific endpoints
  async getCompanyInternships() {
    const response = await api.get<Internship[]>('/company/internships');
    return response.data;
  },

  async getInternshipApplications(internshipId: number) {
    const response = await api.get(`/company/internships/${internshipId}/applications`);
    return response.data;
  },
};

