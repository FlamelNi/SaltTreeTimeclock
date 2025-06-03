import React, { useEffect, useState } from "react";
import "./UserClockPage.css";

const UserClockPage: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [clockedInSince, setClockedInSince] = useState<Date | null>(new Date());
  const [isClockedIn, setIsClockedIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClockIn = () => {
    setClockedInSince(new Date());
    setIsClockedIn(true);
  };

  const handleClockOut = () => {
    setIsClockedIn(false);
  };

  const formatTime = (date: Date | null) => date?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) ?? "";

  return (
    <div className="clock-page">
      {clockedInSince && isClockedIn && <div className="clocked-in-since">Clocked in since: {formatTime(clockedInSince)}</div>}

      <div className="clock-status">
        <h2>{isClockedIn ? "Clocked in" : "Clocked out"}</h2>
        <div className="clock-now">{now.toLocaleString()}</div>

        <div className="clock-buttons">
          <button onClick={handleClockIn} disabled={isClockedIn}>
            Clock In
          </button>
          <button onClick={handleClockOut} disabled={!isClockedIn}>
            Clock Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserClockPage;
