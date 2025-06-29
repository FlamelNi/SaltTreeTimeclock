import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { get_employee_by_username } from "../../firestore";
import "./LandingPage.css";

// Password hashing helper (browser SHA-256)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const LandingPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = await get_employee_by_username(username);
    if (!user) {
      setError("Username or password is incorrect");
      return;
    }
    const hashed = await hashPassword(password);
    if (user.password !== hashed) {
      setError("Username or password is incorrect");
      return;
    }
    // Save session and redirect, ensure object is what App.tsx expects
    window.localStorage.setItem("currentUser", JSON.stringify(user));
    window.dispatchEvent(new Event("storage")); // Ensure App reads the update immediately
    if (user.is_admin) {
      navigate("/report");
    } else {
      navigate("/clockpage");
    }
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
        {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
      </form>
    </div>
  );
};

export default LandingPage;
