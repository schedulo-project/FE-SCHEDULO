import React from "react";

// tagNames : 태그 이름들을 문자열로 받아와서 콤마 슬라이스 후 배열로 변환하여 사용
// tags : tagNames에서 변환된 데이터. 태그 이름들을 받아와서 컴포넌트로 보여주는 역할
// size : 태그의 크기를 조절하기 위한 prop
// response : getTagList API를 통해 받아온 태그 데이터 -> 태그 이름과 색상을 매핑하여 사용하기 위함
// tagColors : 태그 이름과 색상을 매핑한 객체로, 각 태그에 해당하는 색상을 가져오기 위해 사용

const TagBox = ({ task, size }) => {
  const tags = task?.tagName
    ? task.tagName
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")
    : [];

  const tagColors =
    task?.tagColor && task.tagColor !== ""
      ? task.tagColor
          .split(",")
          .map((color) => color.trim())
          .filter((color) => color !== "")
      : [];

  // 태그에 해당하는 색상을 가져오는 함수
  const getTagColor = (index) => {
    // tagColors가 빈 배열이거나 해당 인덱스에 색상이 없으면 회색
    if (
      tagColors.length === 0 ||
      !tagColors[index] ||
      tagColors[index] === "" ||
      tagColors[index] === "null"
    ) {
      return "#9CA3AF"; // 회색 기본값
    }
    return tagColors[index];
  };

  return (
    <div className="flex gap-[0.44rem] ">
      {tags.map((tag, index) => (
        <div
          className={`rounded-[0.625rem] text-[#656565] ${size}`}
          key={index}
          style={{ backgroundColor: getTagColor(index) }}
        >
          {tag}
        </div>
      ))}
    </div>
  );
};

export default TagBox;
