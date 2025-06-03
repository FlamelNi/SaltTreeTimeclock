import React from "react";
import "./NavBar.css";

const NavBar = () => (
  <div className="bottom-nav">
    {["📅", "🔍", "➕", "🔔", "👤"].map((icon, i) => (
      <div key={i} className="nav-icon">
        {icon}
      </div>
    ))}
  </div>
);

export default NavBar;
