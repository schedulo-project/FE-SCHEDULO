import React from "react";

const EventModal = ({ event, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-bold">{event.title}</h3>
        <p className="text-gray-600">
          {event.start.toISOString().slice(0, 10)}
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default EventModal;
