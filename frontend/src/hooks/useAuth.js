import { useState, useCallback, useMemo } from "react";
import { authService } from "../services/authService";

export const useAuth = () => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    user: null,
    isAuthenticated: false,
  });

  // Utility function to update the state
  const updateState = useCallback((newState) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  }, []);

  // Generalized handler for async requests
  const handleRequest = useCallback(
    async (requestFn, ...args) => {
      updateState({ loading: true, error: null });
      try {
        const result = await requestFn(...args);
        return result;
      } catch (error) {
        updateState({ error });
        throw error;
      } finally {
        updateState({ loading: false });
      }
    },
    [updateState]
  );

  // Authentication-related methods
  const authMethods = useMemo(
    () => ({
      createJwt: async (username, password) => {
        try {
          const userProfile = await handleRequest(authService.createJwt, {
            username,
            password,
          });
          updateState({ user: userProfile, isAuthenticated: true });
          return userProfile;
        } catch (error) {
          throw error;
        }
      },

      checkAuth: async () => {
        const data = await handleRequest(authService.checkAuth);
        updateState({ user: data.user, isAuthenticated: true });
        return data;
      },

      logout: async () => {
        await handleRequest(authService.logout);
        updateState({ user: null, isAuthenticated: false });
      },

      createUser: async (userData) => {
        const result = await handleRequest(authService.createUser, userData);
        updateState({ user: result.user, isAuthenticated: true });
        return result;
      },
    }),
    [handleRequest, updateState]
  );

  // Utility to generate additional methods
  const generateMethod = useCallback(
    (methodName) => {
      return async (...args) => handleRequest(authService[methodName], ...args);
    },
    [handleRequest]
  );

  // List of additional methods provided by authService
  const additionalMethods = useMemo(
    () => [
      "refreshJwt",
      "verifyJwt",
      "getUsersList",
      "activateUser",
      "getUserProfile",
      "updateUserProfile",
      "partialUpdateUserProfile",
      "deleteUserProfile",
      "resendActivation",
      "resetPassword",
      "confirmResetPassword",
      "resetUsername",
      "confirmResetUsername",
      "setPassword",
      "setUsername",
      "getUserProfileById",
      "updateUserProfileById",
      "partialUpdateUserProfileById",
      "deleteUserProfileById",
    ],
    []
  );

  // Combine auth methods with generated methods for additional functionality
  const allAuthMethods = useMemo(() => {
    const methods = { ...authMethods };
    additionalMethods.forEach((method) => {
      methods[method] = generateMethod(method);
    });
    return methods;
  }, [authMethods, additionalMethods, generateMethod]);

  // Return state and methods combined
  return useMemo(
    () => ({
      ...state,
      ...allAuthMethods,
    }),
    [state, allAuthMethods]
  );
};
