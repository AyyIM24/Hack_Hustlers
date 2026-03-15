import axios from 'axios';

export const BASE_URL = 'https://hack-hustlers.onrender.com';

const API = axios.create({
  baseURL: BASE_URL,
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

export const getPredictions = async () => {
  const response = await API.get('/predict');
  return response.data;
};

export default API;
