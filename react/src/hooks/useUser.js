import { useState, useEffect } from "react";
import api from "./../api/apiClient";

// User Hooks
export const useUserProfile = (username) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await api.users.profile(username);
        setProfile(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [username]);

  return { profile, loading, error };
};

export const useUpdateUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      await api.users.updateProfile(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
};

// User Role Hook
export const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true);
      try {
        const response = await api.users.getRole(); // Adjust API call based on your implementation
        setRole(response.data.role); // Assume the role is returned in this structure
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  return { role, loading, error };
};
