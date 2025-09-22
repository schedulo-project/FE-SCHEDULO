import { useState } from "react";
import { useAtom } from "jotai";
import { tagModalAtom } from "../atoms/TagAtoms";
import { tagIdListAtom } from "../atoms/HomeAtoms";
import addTag from "../api/addTagApi";

const TagAddModal = () => {
  const [isModalOpen, setIsModalOpen] = useAtom(tagModalAtom);
  const [inputValue, setinputValue] = useState("");
  const [allTags, setAllTags] = useAtom(tagIdListAtom);

  if (!isModalOpen) return null;

  const onClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      alert("태그를 입력해주세요.");
      return;
    } else if (
      allTags.some((tag) => tag.name === inputValue.trim())
    ) {
      alert("이미 존재하는 태그입니다.");
      return;
    }
    const response = await addTag(inputValue); // API 호출
    const newTag = response.data; // 새 태그 객체
    setAllTags((prevTags) => [...prevTags, newTag]); // 기존 태그 목록에 새 태그 추가
    setinputValue(""); // 입력값 초기화
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <form
        className="flex flex-col gap-[1.3rem] justify-center items-center w-[20.25rem] h-[13.375rem] bg-white rounded-[0.635rem] p-[1.26rem]"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        // 상위 요소에서의 클릭 이벤트를 막기 위해 추가
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setinputValue(e.target.value)}
          className="w-56 h-9 rounded-[0.5354rem] bg-slate-200 border border-slate-400 text-slate-400 px-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ex) 운동, 공부"
        />
        <span className="text-[#ABABAB] text-[0.8rem]">
          작성이 완료되면 엔터를 눌러주세요.
        </span>
      </form>
    </div>
  );
};

export default TagAddModal;
