import React, { useState } from "react";
import "../styles/TagSelect.css";

const Tag = ({ selectedTags, tagOptions, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // 태그 추가
  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag]); // 부모 컴포넌트 상태 업데이트
    }
    setIsOpen(false);
  };

  // 태그 삭제
  const removeTag = (tag) => {
    onChange(selectedTags.filter((item) => item !== tag));
  };

  return (
    <div className="tag-container">
      <div className="tag-box" onClick={() => setIsOpen(!isOpen)}>
        {selectedTags.length > 0 ? (
          selectedTags.map((tag, index) => (
            <div key={index} className="tag-item">
              {tag}
              <span
                className="close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
              >
                ×
              </span>
            </div>
          ))
        ) : (
          <span className="placeholder">태그를 선택하세요</span>
        )}
      </div>

      {isOpen && (
        <div className="dropdown">
          {tagOptions
            .filter((tag) => !selectedTags.includes(tag)) // 이미 선택된 태그 제외
            .map((tag, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => addTag(tag)}
              >
                {tag}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Tag;
