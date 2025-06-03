import React, { useEffect, useState } from "react";
import { useAuth } from "../GoogleAuthProvider";
import { listEvents } from "../services/CalendarService";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { GoogleEvent } from "../types/GoogleEvent";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const localizer = momentLocalizer(moment);
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

// Fix the rbc-time-header margin issue function (shared)
function fixHeaderMargin() {
  const header = document.querySelector(".rbc-time-header");
  if (header) {
    if (window.innerWidth <= 600) {
      (header as HTMLElement).style.marginRight = "0px";
    } else {
      // Optionally reset it if you want to keep default on desktop
      // (header as HTMLElement).style.marginRight = '';
    }
  }
}

export default function CalendarPage() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (user) {
        const events: GoogleEvent[] = await listEvents(user);
        setEvents(
          events.map((event: GoogleEvent) => {
            // Use current date as a fallback if start or end is missing
            const startDate = event.start.dateTime || event.start.date || new Date().toISOString();
            const endDate = event.end.dateTime || event.end.date || new Date().toISOString();

            return {
              id: event.id,
              title: event.summary || "No Title",
              start: new Date(startDate),
              end: new Date(endDate),
            };
          })
        );
      }
    };

    fetchEvents();
  }, [user]);

  // Fix header margin on load and resize
  useEffect(() => {
    fixHeaderMargin();
    window.addEventListener("resize", fixHeaderMargin);
    return () => window.removeEventListener("resize", fixHeaderMargin);
  }, []);

  // Fix header margin also on calendar view change
  const handleCalendarView = () => {
    fixHeaderMargin();
  };

  return (
    <div className="calendar-page-container">
      <Button variant="danger" onClick={logout}>
        <i className="bi bi-box-arrow-right"></i> Logout
      </Button>
      <h2>Welcome, {user?.name}</h2>
      <div style={{ height: "80vh" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          selectable
          defaultView="week"
          scrollToTime={new Date()}
          style={{ height: "100%" }}
          onView={handleCalendarView}
        />
      </div>
    </div>
  );
}
