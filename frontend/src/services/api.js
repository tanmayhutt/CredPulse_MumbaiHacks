import axios from 'axios';

const APIBASEURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// ============ REGULAR API (JSON) ============
const api = axios.create({
  baseURL: `${APIBASEURL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accesstoken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('useremail');
      window.location.href = '/login';
    }

    // Transform Pydantic errors to safe strings
    if (error.response?.data) {
      const data = error.response.data;

      if (Array.isArray(data)) {
        const messages = data
          .map((err) => {
            const field = err.loc?.[0] || 'field';
            return `${field}: ${err.msg}`;
          })
          .join(', ');
        error.safeMessage = messages;
      } else if (data.detail) {
        error.safeMessage =
          typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
      } else if (data.msg) {
        error.safeMessage = `${data.loc?.join('.') || 'Error'}: ${data.msg}`;
      } else {
        error.safeMessage = JSON.stringify(data);
      }
    }

    return Promise.reject(error);
  }
);

// ============ FILE UPLOAD API (Multipart) ============
const uploadApi = axios.create({
  baseURL: `${APIBASEURL}/api/v1`,
  timeout: 60000, // Longer timeout for large files
});

uploadApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accesstoken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // CRITICAL: Don't set Content-Type for FormData
  // Browser will automatically set it to multipart/form-data with boundary
  delete config.headers['Content-Type'];
  return config;
});

uploadApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Same error handling as regular API
    if (error.response?.data) {
      const data = error.response.data;
      if (Array.isArray(data)) {
        const messages = data
          .map((err) => {
            const field = err.loc?.[0] || 'field';
            return `${field}: ${err.msg}`;
          })
          .join(', ');
        error.safeMessage = messages;
      } else if (data.detail) {
        error.safeMessage =
          typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
      } else if (data.msg) {
        error.safeMessage = `${data.loc?.join('.') || 'Error'}: ${data.msg}`;
      } else {
        error.safeMessage = JSON.stringify(data);
      }
    }
    return Promise.reject(error);
  }
);

// ============ AUTH APIS ============
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (email, password, merchantname) => {
  const response = await api.post('/auth/register', {
    email,
    password,
    merchantname,
  });
  return response.data;
};

// ============ INVOICE APIS ============

// FILE UPLOAD - Use uploadApi instead of api
export const uploadInvoice = async (file, merchantId = 1) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('merchant_id', merchantId);

  console.log('📤 Uploading file:', file.name, file.size, file.type);

  // Use uploadApi (multipart) NOT api (json)
  const response = await uploadApi.post('/invoices/upload', formData);
  
  console.log('✅ Upload response:', response.data);
  return response.data;
};

export const listInvoices = async (merchantId = 1) => {
  const response = await api.get(`/invoices/list?merchant_id=${merchantId}`);
  return response.data;
};

export const getInvoice = async (invoiceId) => {
  const response = await api.get(`/invoices/${invoiceId}`);
  return response.data;
};

export const verifyInvoice = async (invoiceId) => {
  const response = await api.post(`/invoices/${invoiceId}/verify`);
  return response.data;
};

// ============ AGENT APIS ============
export const runAgentAnalysis = async (invoiceId, buyerId, merchantId = 1) => {
  const response = await api.post('/agents/analyze', {
    invoice_id: invoiceId,
    buyer_id: buyerId,
    merchant_id: merchantId,
  });
  return response.data;
};

export const getAgentStatus = async (analysisId) => {
  const response = await api.get(`/agents/status/${analysisId}`);
  return response.data;
};

// ============ OFFERS APIS ============
export const listOffers = async (merchantId = 1) => {
  const response = await api.get(`/offers/list?merchant_id=${merchantId}`);
  return response.data;
};

export const getOffer = async (offerId) => {
  const response = await api.get(`/offers/${offerId}`);
  return response.data;
};

export const acceptOffer = async (offerId) => {
  const response = await api.post(`/offers/${offerId}/accept`);
  return response.data;
};

export const rejectOffer = async (offerId) => {
  const response = await api.post(`/offers/${offerId}/reject`);
  return response.data;
};

// ============ CONSENT APIS ============
export const getConsents = async (userId) => {
  const response = await api.get(`/consent/list?user_id=${userId}`);
  return response.data;
};

export const grantConsent = async (consentData) => {
  const response = await api.post('/consent/grant', consentData);
  return response.data;
};

export const revokeConsent = async (consentId) => {
  const response = await api.post(`/consent/${consentId}/revoke`);
  return response.data;
};

// ============ AUDIT APIS ============
export const getAuditLogs = async (filters = {}) => {
  const response = await api.get('/audit/logs', { params: filters });
  return response.data;
};

// ============ DASHBOARD APIS ============
export const getDashboard = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export default api;
