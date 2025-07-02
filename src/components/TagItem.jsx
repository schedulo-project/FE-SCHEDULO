import { useState } from "react";
import { useAtom } from "jotai";
import {
  tagIdListAtom,
  handleChangeAtom,
  modalDataAtom,
  isModalOpenAtom,
} from "../atoms/HomeAtoms";

//통신부분
import putTag from "../api/putTagApi";

//모달
import ScheduleModal from "./ScheduleModal";

const TagItem = ({ eventsList }) => {
  //더블 클릭을 해서 수정하고 있는 상태인지 확인하는 State
  const [isEditing, setIsEditing] = useState(false);
  const [tempTag, setTempTag] = useState(eventsList.tag);

  //바뀌는 태그 업데이트
  const [allTags, setAllTags] = useAtom(tagIdListAtom);
  // 일정 데이터 변경
  const [, sethandleChange] = useAtom(handleChangeAtom);

  //일정 모달 띄우기 위한 데이터
  const [, setModalData] = useAtom(modalDataAtom);
  const [, setIsModalOpen] = useAtom(isModalOpenAtom);

  const eventListChange = (origin, changedTagName) => {
    eventsList.task.forEach((event) => {
      const tags = event.tagName
        .split(",")
        .map((tag) => tag.trim());
      const updatedTags = tags.map((tagName) =>
        tagName === origin ? changedTagName : tagName
      );
      event.tagName = updatedTags.join(",");
      sethandleChange(event); // 변경된 일정 전달
    });
  };

  const taskTagChange = (changedTagName, tagId) => {
    setAllTags((prevTags) =>
      prevTags.map((tag) =>
        tag.id === tagId
          ? {
              ...tag,
              id: tagId,
              name: changedTagName,
            }
          : tag
      )
    );
    // 이벤트는 따로 다시 fetch하거나 재동기화
  };

  const taskTagDelete = (tagId, tagName) => {
    //태그 아이디가 같지 않은 태그만 넣어준다.
    setAllTags((prevTags) =>
      prevTags.filter((tag) => tag.id !== tagId)
    );
    console.log("태그 삭제 로직 실행", allTags);

    //태그 일금이 같은 것빼고 넣어준다.
    eventsList.task.forEach((event) => {
      const updatedTags = event.tagName
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== tagName);

      event.tagName = updatedTags.join(",");
      sethandleChange(event);
      console.log("태그 삭제 로직 실행", eventsList);
    });
  };

  const doubleClickToEdit = (origin, tagId) => {
    const trimmedTempTag = tempTag.trim();
    if (origin == trimmedTempTag) {
      setIsEditing(false);
      return;
    } else if (trimmedTempTag === "") {
      taskTagDelete(tagId, origin);
    } else {
      taskTagChange(trimmedTempTag, tagId);
      eventListChange(origin, trimmedTempTag);
      putTag(trimmedTempTag, tagId);
    }

    setIsEditing(false);
  };

  const handleClick = (event) => {
    console.log("일정 클릭", event);
    const clickedEventData = {
      id: Number(event.id), // 고친 부분 기존에는 string으로 들어옴 event.id는 number여서 문제가 생겼음

      title: event.title,
      date: event.date,
      content: event.content || "",
      tagName: event.tagName || "",
      is_completed: event.is_completed,
      deadline: event.deadline || null,
    };
    setModalData(clickedEventData);
    setIsModalOpen(true);
  };

  return (
    <div className="flex justify-center items-center">
      <>
        {console.log("모달 열림")}
        <ScheduleModal />
      </>
      <div className="w-[16rem] h-[24rem] bg-[#F0F0F0] shadow-[0px_3.759999990463257px_3.759999990463257px_0px_rgba(0,0,0,0.25)] border-[0.47px] border-stone-500 rounded-2xl p-8">
        <section className="flex justify-between items-center">
          {isEditing ? (
            <input
              type="text"
              //기존의 값을 가져온다.
              value={tempTag}
              onChange={(v) => {
                //바뀐 값으로 업데이트 해준다.
                setTempTag(v.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  //enter를 눌렀을 때 작동되는 함수
                  doubleClickToEdit(
                    eventsList.tag,
                    eventsList.tagId
                  );
                }
              }}
            />
          ) : (
            <div
              onDoubleClick={() => {
                if (tempTag === "태그 없음") {
                  //태그가 비어있으면 수정 모드로 들어가지 않는다.
                  return;
                }
                //수정 모드로 변환
                setIsEditing(true);
                //태그 값을 넘겨준다. 이전 값을 기억하고 있기 위해
                setTempTag(eventsList.tag);
              }}
            >
              {tempTag}
            </div>
          )}
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        </section>
        <div className="mt-4 flex-grow h-[0.04619rem] bg-[#ABABAB] max-w-[9.33019rem] mx-[0.44rem]"></div>
        <section className="flex flex-col items-start gap-2 mt-4 overflow-y-scroll h-[16rem]">
          {eventsList.task.map((event) => (
            <div
              key={event.id}
              onClick={() => {
                handleClick(event);
              }}
            >
              {event.title}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
export default TagItem;
