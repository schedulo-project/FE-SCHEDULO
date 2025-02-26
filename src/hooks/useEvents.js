import { useState } from "react";

const useEvents = () => {
  const [events, setEvents] = useState([]);

  const addEvent = (event) => {
    setEvents([...events, event]);
  };

  return { events, addEvent };
};

export default useEvents;
