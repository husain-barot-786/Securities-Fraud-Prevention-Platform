import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fraudAPI = {
  getAllTips: () => api.get('/fraud/tips/'),
  addTip: (tip) => api.post('/fraud/tips/', tip),
};

export const alertsAPI = {
  getAllAlerts: () => api.get('/alerts/'),
  getActiveAlerts: () => api.get('/alerts/?status=active'),
  addAlert: (alert) => api.post('/alerts/', alert),
};

export const verificationAPI = {
  getAllAdvisors: () => api.get('/verify/advisors/'),
  searchAdvisor: (name) => api.get(`/verify/advisors/search/?name=${name}`),
};

export const announcementsAPI = {
  getAllAnnouncements: () => api.get('/announcements/'),
  getVerifiedAnnouncements: () => api.get('/announcements/?verified=true'),
};

export const fraudRulesAPI = {
  testMessage: (data) => api.post('/fraud-rules/test/', data),
  getAllRules: () => api.get('/fraud-rules/'),
};

export default api;
