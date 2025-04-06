import React, { useState } from "react";
import axios from "axios";

const EventForm = ({ addEvent }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [tag, setTag] = useState("1");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !date || !content) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("scheduled_date", date);
    formData.append("tag", tag);

    try {
      const response = await axios.post(
        "http://13.124.140.60/schedules/",
        formData
      );
      console.log("일정 추가 성공:", response.data);

      addEvent({
        id: response.data.id,
        title: response.data.title,
        date: response.data.scheduled_date,
      });
      setTitle("");
      setDate("");
      setContent("");
    } catch (error) {
      console.error("오류 발생:", error);
    }
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
      <textarea
        placeholder="일정 내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        추가
      </button>
    </form>
  );
};

export default EventForm;
