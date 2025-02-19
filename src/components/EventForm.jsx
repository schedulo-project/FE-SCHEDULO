import React, { useState } from "react";

const EventForm = ({ addEvent }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date) return;
    addEvent({ title, date });
    setTitle("");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="일정 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded"
      >
        추가
      </button>
    </form>
  );
};

export default EventForm;
