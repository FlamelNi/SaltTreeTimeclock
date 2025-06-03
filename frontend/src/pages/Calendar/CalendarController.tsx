import React from "react";
import "./CalendarController.css";
import { Button } from "react-bootstrap";

const CalendarController = () => (
  <div className="calendar-controller">
    <button className="nav-btn">
      <img src="/src/assets/left_arrow_circle.png" alt="Left" />
    </button>
    <button className="nav-btn">
      <img src="/src/assets/right_arrow_circle.png" alt="Right" />
    </button>
    <Button>Today</Button>
    <button className="plus-btn">+</button>
  </div>
);

export default CalendarController;
