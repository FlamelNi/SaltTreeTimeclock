import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../GoogleAuthProvider";
import { listEvents } from "../../services/CalendarService";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { GoogleEvent } from "../../types/GoogleEvent";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import CalendarController from "./CalendarController";

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

export default function CalendarComp() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const navigate = useNavigate();
  const calendarContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Scroll .rbc-time-content to the bottom when events load
    if (calendarContainerRef.current) {
      const container = calendarContainerRef.current.querySelector(".rbc-time-content");
      if (container) {
        (container as HTMLElement).scrollTop = (container as HTMLElement).scrollHeight;
      }
    }
  }, [events]);

  return (
    <div className="calendar-page-container" style={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <CalendarController />
      <div
        ref={calendarContainerRef}
        style={{
          flexGrow: 1,
          minHeight: 0,
          height: "calc(100vh - 100px)", // Adjust 100px if you have a header, etc.
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          selectable
          defaultView="week"
          style={{ height: "100%" }}
          onView={handleCalendarView}
          toolbar={false}
        />
      </div>
    </div>
  );
}
