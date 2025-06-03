import axios from "axios";
import { User } from "../GoogleAuthProvider";

export const listEvents = async (user: User) => {
  try {
    const response = await axios.get("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return [];
  }
};

export const createEvent = async (user: User, event: any) => {
  try {
    const response = await axios.post("https://www.googleapis.com/calendar/v3/calendars/primary/events", event, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return null;
  }
};
