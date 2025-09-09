import React from "react";
import { useAtom } from "jotai";
import { isModalOpenAtom, modalDataAtom } from "../atoms/HomeAtoms";

const EditButton = ({ date, category, item }) => {
  const [, setIsModalOpen] = useAtom(isModalOpenAtom);
  const [, setModalData] = useAtom(modalDataAtom);

  const handleEditClick = () => {
    // tagName을 문자열 콤마 구분으로 변환
    let tagNameString = "";
    if (Array.isArray(item.tag)) {
      tagNameString = item.tag.map(t => t.name || t).join(",");
    } else if (Array.isArray(category)) {
      tagNameString = category.map(t => t.name || t).join(",");
    } else if (typeof item.tag === "string") {
      tagNameString = item.tag;
    } else if (typeof category === "string") {
      tagNameString = category;
    }

    // tagColor를 문자열 콤마 구분으로 변환
    let tagColorString = "";
    if (Array.isArray(item.tag)) {
      tagColorString = item.tag.map(t => t.color || "").join(",");
    } else if (typeof item.tagColor === "string") {
      tagColorString = item.tagColor;
    }

    const clickedEventData = {
      id: typeof item.id === "string" ? Number(item.id) : item.id ?? null,
      title: item.title || "",
      date: item.date || date || "",
      content: item.content || "",
      tagName: tagNameString,
      tagColor: tagColorString,
      is_completed:
        typeof item.is_completed === "boolean" ? item.is_completed : false,
      deadline: item.deadline ?? null,
    };

    setModalData(clickedEventData);
    setIsModalOpen(true);
  };

  return (
    <button className="border-1 border-black" onClick={handleEditClick}>
      수정하기
    </button>
  );
};

export default EditButton;
