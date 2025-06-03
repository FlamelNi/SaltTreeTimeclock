import { useNavigate } from "react-router-dom";
import googleLogo from "/src/assets/Google__G__logo.svg";

import "./LandingPage.css";
import { useAuth } from "../../GoogleAuthProvider";
import { useEffect } from "react";

export default function LandingPage() {
  const navigate = useNavigate();

  const { login, user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/calendar");
    }
  }, [user, navigate]);

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

        <button className="google-button" onClick={login}>
          <img src={googleLogo} alt="Google" />
          <span>Continue with Google</span>
        </button>

        <p className="agreement">
          By clicking continue, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
