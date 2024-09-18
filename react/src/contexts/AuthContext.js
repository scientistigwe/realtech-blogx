// context/AuthContext.js
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
      console.log("Request started");
      try {
        const result = await requestFn(...args);
        console.log("Request succeeded:", result);
        return result;
      } catch (error) {
        console.error("Request failed:", error);
        updateState({ error });
        throw error;
      } finally {
        updateState({ loading: false });
        console.log("Request completed");
      }
    },
    [updateState]
  );

  const authMethods = useMemo(
    () => ({
      createJwt: async (username, password) => {
        console.log("Creating JWT...");
        const userProfile = await handleRequest(authService.createJwt, {
          username,
          password,
        });
        console.log("JWT created:", userProfile);
        updateState({ user: userProfile, isAuthenticated: true });
        return userProfile;
      },
      checkAuth: async () => {
        console.log("Checking authentication...");
        const data = await handleRequest(authService.checkAuth);
        console.log("Authentication checked:", data);
        updateState({ user: data.user, isAuthenticated: true });
        return data;
      },
      logout: async () => {
        console.log("Logging out...");
        await handleRequest(authService.logout);
        console.log("Logged out");
        updateState({ user: null, isAuthenticated: false });
      },
      createUser: async (userData) => {
        console.log("Creating user");
        const result = await handleRequest(authService.createUser, userData);
        updateState({ user: result.user, isAuthenticated: true });
        console.log("User created:", result);
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

  return (
    <AuthContext.Provider value={{ ...state, ...allAuthMethods }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
