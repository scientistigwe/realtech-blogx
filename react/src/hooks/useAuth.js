import { useState, useCallback, useMemo } from "react";
import Cookies from "js-cookie"; // Import js-cookie
import { authService } from "../services/authService";

export const useAuth = () => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    user: null,
    isAuthenticated: false,
  });

  const updateState = useCallback((newState) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  }, []);

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

  const authMethods = useMemo(
    () => ({
      createJwt: async (username, password) => {
        try {
          const userProfile = await handleRequest(authService.createJwt, {
            username,
            password,
          });
          Cookies.set("sessionid", userProfile.sessionid); // Store sessionid in cookies
          updateState({ user: userProfile, isAuthenticated: true });
          return userProfile;
        } catch (error) {
          throw error; // Pass error to be handled by the component
        }
      },

      checkAuth: async () => {
        const data = await handleRequest(authService.checkAuth);
        updateState({ user: data.user, isAuthenticated: true });
        return data;
      },

      logout: async () => {
        await handleRequest(authService.logout);
        Cookies.remove("sessionid"); // Remove sessionid from cookies
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

  const generateMethod = useCallback(
    (methodName) => {
      return async (...args) => handleRequest(authService[methodName], ...args);
    },
    [handleRequest]
  );

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

  const allAuthMethods = useMemo(() => {
    const methods = { ...authMethods };
    additionalMethods.forEach((method) => {
      methods[method] = generateMethod(method);
    });
    return methods;
  }, [authMethods, additionalMethods, generateMethod]);

  return useMemo(
    () => ({
      ...state,
      ...allAuthMethods,
    }),
    [state, allAuthMethods]
  );
};
