const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Registration endpoints
  async startRegistration(userData) {
    return this.request('/auth/register/begin', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async finishRegistration(registrationData) {
    return this.request('/auth/register/complete', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  }

  // Authentication endpoints
  async startAuthentication(payload) {
    return this.request('/auth/login/begin', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async finishAuthentication(authData) {
    return this.request('/auth/login/complete', {
      method: 'POST',
      body: JSON.stringify(authData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/auth/health');
  }
}

export default new ApiService();