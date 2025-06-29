import React, { useEffect, useState } from "react";
import "./UserClockPage.css";
import UserBar from "../../components/UserBar/UserBar";
import { Employee } from "../../datatype";
import { update_employee } from "../../firestore";
import { Timestamp } from "firebase/firestore";

interface Props {
  curr_user: Employee | null;
  onLogout: () => void;
}
const UserClockPage: React.FC<Props> = ({ curr_user, onLogout }) => {
  const [now, setNow] = useState(new Date());
  const [clockedInSince, setClockedInSince] = useState<Date | null>(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [internalUser, setInternalUser] = useState<Employee | null>(curr_user);

  // Update now every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Set state when user data changes
  useEffect(() => {
    if (!curr_user) {
      setIsClockedIn(false);
      setClockedInSince(null);
      setInternalUser(null);
      return;
    }
    setInternalUser(curr_user);
    if (curr_user.is_on_work) {
      setIsClockedIn(true);
      // If curr_user.time_in is a Firestore Timestamp, convert it to JS Date
      if (curr_user.time_in && typeof curr_user.time_in.toDate === "function") {
        setClockedInSince(curr_user.time_in.toDate());
      } else {
        setClockedInSince(null);
      }
    } else {
      setIsClockedIn(false);
      setClockedInSince(null);
    }
  }, [curr_user]);

  // Handle clock in
  const handleClockIn = async () => {
    if (!internalUser) return;
    const nowDate = new Date();
    setClockedInSince(nowDate);
    setIsClockedIn(true);

    const newTimeIn = Timestamp.fromDate(nowDate);

    // Update Firestore
    await update_employee(internalUser.id, {
      is_on_work: true,
      time_in: newTimeIn,
    });
    // Update local user and localStorage
    const updatedUser = { ...internalUser, is_on_work: true, time_in: newTimeIn };
    window.localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setInternalUser(updatedUser);
  };

  // Handle clock out
  const handleClockOut = async () => {
    if (!internalUser) return;
    setIsClockedIn(false);
    setClockedInSince(null);

    await update_employee(internalUser.id, {
      is_on_work: false,
      time_in: undefined, // Do not set to null to avoid TS error
    });
    const updatedUser = new Employee(
      internalUser.id,
      internalUser.is_admin,
      internalUser.name,
      internalUser.password,
      internalUser.pay_rate,
      internalUser.username,
      false,
      undefined // time_in is undefined
    );
    window.localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setInternalUser(updatedUser);
  };

  // Format the clock in time
  const formatTime = (date: Date | null) => date?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) ?? "";

  if (!internalUser) {
    return <div>User not found.</div>;
  }

  return (
    <>
      <div className="clock-page-margin">
        <UserBar
          is_dropdown={false}
          is_user_change={false}
          user_list={[internalUser]}
          curr_user={internalUser}
          curr_user_set={() => {}}
          onLogout={onLogout}
        />
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
      </div>
    </>
  );
};

export default UserClockPage;
