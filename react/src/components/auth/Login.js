import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../features/auth/authThunks"; // Adjust the path as necessary
import { toast } from "react-toastify";
import "../../styles/Login.css"; // Import the CSS file

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(loginUser(credentials));
      console.log(`Response after login: ${JSON.stringify(response)}`);
      if (
        response.meta.requestStatus === "fulfilled" &&
        response.payload.isAuthenticated
      ) {
        toast.success("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 2000); // Redirect after 2 seconds
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
