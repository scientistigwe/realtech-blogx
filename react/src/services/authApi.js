import apiClientBase from "./apiClientBase";
import { apiEndpoints } from "./apiEndpoints";

const apiClient = apiClientBase;

export const loginApi = (credentials) =>
  apiClient.post(apiEndpoints.auth.login, credentials);

export const logoutApi = () => apiClient.post(apiEndpoints.auth.logout);

export const registerApi = (formData) =>
  apiClient.post(apiEndpoints.auth.register, formData);

export const checkAuthenticationApi = () =>
  apiClient.get(apiEndpoints.auth.checkAuthentication);

export const refreshTokenApi = () =>
  apiClient.post(apiEndpoints.auth.refreshToken);

export const requestPasswordResetApi = (email) =>
  apiClient.post(apiEndpoints.auth.requestPasswordReset, { email });

export const updatePasswordApi = (passwordData) =>
  apiClient.post(apiEndpoints.auth.updatePassword, passwordData);
