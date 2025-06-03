import { useNavigate } from "react-router-dom";

import "./LandingPage.css";
import { useEffect } from "react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <div className="login-container">
        <h1 className="logo">Peekatime</h1>
        <div className="tagline">
          <p>Share schedules,</p>
          <p>Plan meetings,</p>
          <p>With friends</p>
        </div>

        <h2 className="login-prompt">Login with Google account</h2>

        <p className="agreement">
          By clicking continue, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
