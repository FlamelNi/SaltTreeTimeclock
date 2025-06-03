import React from "react";
import TopBar from "./TopBar/TopBar";
import UserSummary from "./UserSummary/UserSummary";
import NavBar from "./NavBar/NavBar";
import CalendarComp from "./Calendar/CalendarComp";

const NAVBAR_HEIGHT = 56; // px, adjust according to your NavBar's real height!

const UserCalendarPage = () => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Content area */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <TopBar />
        <UserSummary />
        <CalendarComp />
      </div>
      <div style={{ height: NAVBAR_HEIGHT }}>
        <NavBar />
      </div>
    </div>
  );
};

export default UserCalendarPage;
