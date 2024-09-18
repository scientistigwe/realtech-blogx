import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser, loginUser } from "../../features/auth/authThunks"; // Import register and loginUser thunks
import { toast } from "react-toastify"; // Import toast
import "../../styles/Login.css"; // Import the same CSS file as Login

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true); // Set loading state to true

    const { username, email, password, confirmPassword } = formData;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setFormError("All fields are required.");
      toast.error("All fields are required."); // Show toast error
      setLoading(false); // Set loading state to false
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      toast.error("Passwords do not match."); // Show toast error
      setLoading(false); // Set loading state to false
      return;
    }

    try {
      // Dispatch the register thunk
      const registerResult = await dispatch(
        registerUser({
          username,
          email,
          password,
          re_password: confirmPassword,
        }) // Added re_password
      );

      if (registerResult.meta.requestStatus === "fulfilled") {
        // After successful registration, log in the user
        const loginResult = await dispatch(loginUser({ username, password }));
        if (loginResult.meta.requestStatus === "fulfilled") {
          toast.success("Registration successful!"); // Show toast success
          navigate("/dashboard");
        } else {
          throw new Error("Login failed after registration");
        }
      } else {
        throw new Error("Registration failed");
      }
    } catch (err) {
      setFormError(err.message || "Failed to register. Please try again.");
      toast.error(err.message || "Failed to register. Please try again."); // Show toast error
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="login-container">
      {/* Use the same container class as Login */}
      <div className="login-form">
        {/* Use the same form class as Login */}
        <h1>Register</h1>
        {formError && <p>{formError}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
