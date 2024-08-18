export const handleResponse = async (apiCall, setAuthStatus) => {
  try {
    const response = await apiCall();
    console.log("API Response received:", response);
    if (response.data?.expirationTime) {
      console.log(
        "Setting auth status with expiration time:",
        response.data.expirationTime
      );
      setAuthStatus(true, response.data.expirationTime);
    }
    return response.data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

export const checkAuthenticationUtil = (getAuthStatus) => {
  if (getAuthStatus()) {
    console.log("Auth status found in Redux state.");
    return { isAuthenticated: true };
  }
  return null;
};
