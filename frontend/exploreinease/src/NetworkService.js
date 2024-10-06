// src/NetworkService.js

import axios from 'axios';

// Set the base URL from environment variables
const BASE_URL = 'http://localhost:3030'; 

class NetworkService {
  // Helper method to transform the URL based on parameters
  static transform(url, params) {
    if (params) {
      Object.keys(params).forEach(param => {
        // Replace placeholder with actual parameter value
        url = url.replace(`{${param}}`, params[param]);
      });
    }
    return url;
  }

  // Prepare query parameters
  static prepareQuery(query) {
    const params = new URLSearchParams();
    for (const key in query) {
      if (query[key] !== undefined) {
        params.append(key, query[key]);
      }
    }
    return params;
  }

  // GET method
  static async get(options) {
    const apiPath = this.transform(options.apiPath, options.urlParam);
    const params = this.prepareQuery(options.query);
    
    try {
      const response = await axios.get(`${BASE_URL}${apiPath}`, {
        params: params,
        headers: options.headers,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // POST method
  static async post(options) {
    const apiPath = this.transform(options.apiPath, options.urlParam);
    const params = this.prepareQuery(options.query);
    
    try {
      const response = await axios.post(`${BASE_URL}${apiPath}`, options.body || {}, {
        params: params,
        headers: options.headers,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // PUT method
  static async put(options) {
    const apiPath = this.transform(options.apiPath, options.urlParam);
    const params = this.prepareQuery(options.query);
    
    try {
      const response = await axios.put(`${BASE_URL}${apiPath}`, options.body || {}, {
        params: params,
        headers: options.headers,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // DELETE method
  static async delete(options) {
    const apiPath = this.transform(options.apiPath, options.urlParam);
    const params = this.prepareQuery(options.query);
    
    try {
      const response = await axios.delete(`${BASE_URL}${apiPath}`, {
        params: params,
        headers: options.headers,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Handle errors
  static handleError(error) {
    // You can customize your error handling logic here
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error('Error Response:', error.response.data);
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Error Request:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
    }
    throw error; // Re-throw the error for handling in the calling component
  }
}

export default NetworkService;
