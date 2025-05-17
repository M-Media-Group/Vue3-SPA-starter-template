// src/services/apiService.ts
import axios, { type AxiosError, type AxiosInstance } from "axios";
import i18n from "@/locales/i18n";

// Configure an Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Uncomment and set if you have a common base URL prefix for all API calls
  withCredentials: true, // Crucial for cookie-based authentication (e.g., Laravel Sanctum)
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
  },
});

// Intercept requests to add the locale header
apiClient.interceptors.request.use((config) => {
  const locale = i18n.global.locale.value; // Get the current locale from i18n
  if (locale) {
    config.headers["Accept-Language"] = locale; // Set the Accept-Language header
  }
  return config;
});

/**
 * Handles API errors, logs them, and re-throws them.
 * @param error The AxiosError object.
 * @param operation A string describing the operation during which the error occurred.
 */
const handleError = (
  error: AxiosError,
  operation: string = "API operation"
) => {
  const status = error.response?.status;
  const message =
    (error.response?.data as { message?: string })?.message || error.message;
  console.error(
    `Error during ${operation}: Status ${
      status || "N/A"
    } - Message: ${message}`,
    error.response?.data || error
  );
  throw error; // Re-throw the error to be handled by the caller
};

/**
 * Fetches the CSRF cookie from the server.
 * Typically required by Laravel Sanctum before making state-changing requests.
 */
async function fetchCsrfToken(): Promise<void> {
  try {
    await apiClient.get("/sanctum/csrf-cookie");
  } catch (error) {
    // This is a critical error for subsequent state-changing requests
    handleError(error as AxiosError, "fetching CSRF cookie");
  }
}

export const apiService = {
  /**
   * Performs a GET request.
   * @param url The URL to request.
   * @param params Optional query parameters.
   */
  async get<T>(url: string, params?: object): Promise<T> {
    try {
      const response = await apiClient.get<T>(url, { params });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, `GET ${url}`);
      throw error; // Ensure re-throw after handleError
    }
  },

  /**
   * Performs a POST request.
   * @param url The URL to post to.
   * @param data The data to send.
   */
  async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await apiClient.post<T>(url, data);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, `POST ${url}`);
      throw error;
    }
  },

  /**
   * Performs a PUT request.
   * @param url The URL to put to.
   * @param data The data to send.
   */
  async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await apiClient.put<T>(url, data);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, `PUT ${url}`);
      throw error;
    }
  },

  /**
   * Performs a DELETE request.
   * @param url The URL to delete from.
   */
  async delete<T>(url: string): Promise<T> {
    try {
      const response = await apiClient.delete<T>(url);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, `DELETE ${url}`);
      throw error;
    }
  },

  /**
   * Ensures the CSRF cookie is fetched.
   * Call this before operations that require CSRF protection if not handled automatically.
   */
  getCsrfToken: fetchCsrfToken,
};
