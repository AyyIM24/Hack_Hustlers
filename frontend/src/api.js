import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
});

export const registerPatient = async (patientData) => {
  const response = await API.post('/register', patientData);
  return response.data;
};

export const getPatientById = async (patientId) => {
  const response = await API.get(`/patient/${patientId}`);
  return response.data;
};

export const getAllPatients = async () => {
  const response = await API.get('/patients');
  return response.data;
};

export const updatePatientRecord = async (patientId, updateData) => {
  const response = await API.put(`/patient/${patientId}`, updateData);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await API.get('/analytics');
  return response.data;
};

export const getAlerts = async (threshold = 3) => {
  const response = await API.get(`/alerts?threshold=${threshold}`);
  return response.data;
};

export default API;
