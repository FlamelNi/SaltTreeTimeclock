import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { username, password });
    // Add logic here
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label">
          Username
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="login-input" required />
        </label>

        <label className="login-label">
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="login-input" required />
        </label>

        <Button type="submit" className="login-button" variant="dark">
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default LandingPage;
