import TagItem from "../components/TagItem";
import { useAtom } from "jotai";
import { eventsAtoms } from "../atoms/HomeAtoms";
import { useEffect } from "react";
import fetchSchedules from "../api/checkScheduleApi";

const Tag = () => {
  // 일정 데이터 불러오기(api)
  const [allEvents, setEvents] = useAtom(eventsAtoms);

  // 페이지가 처음 로드될 때만 데이터를 불러오도록 useEffect 사용 이미 있으면 통신 안 함
  useEffect(() => {
    if (allEvents.length > 0) {
      // 이미 데이터가 있으면 통신 안 함
      return;
    }

    const loadSchedules = async () => {
      try {
        const transformedEvents = await fetchSchedules(
          "2025-02-28",
          "2025-12-30"
        );
        setEvents(transformedEvents);
      } catch (error) {
        console.error("Error loading schedules", error);
      }
    };
    loadSchedules();
  }, [allEvents, setEvents]);

  // 이벤트를 태그별로 그룹화하는 함수
  // 단순히 태그 이름을 기준으로 그룹화하고, 태그가 없는 작업은 별도로 모아둠, 완료된 작업과 되지 않은 작업은 구분하지 않음
  const groupBy = (list) => {
    const tagGroups = new Map();
    const noTagGroup = [];

    list.forEach((task) => {
      // 태그가 , 으로 나누어져 있어 이를 분리해주는 코드
      const firstTag = task.tagName?.split(",")[0]?.trim();
      if (firstTag) {
        if (!tagGroups.has(firstTag)) {
          // 태그가 처음 등장하면 새로운 배열을 생성
          tagGroups.set(firstTag, []);
        }
        tagGroups.get(firstTag).push(task);
      } else {
        noTagGroup.push(task);
      }
    });

    // 최종 배열을 넣어줄 곳
    const result = [];

    // 순서대로 배치하기 위해 3가지로 나눔
    // 1. 태그로 묶인 작업
    for (const [tag, tasks] of tagGroups.entries()) {
      result.push({ tag, task: tasks });
    }

    // 2. 태그 없음 그룹 추가
    if (noTagGroup.length > 0) {
      result.push({ tag: "태그 없음", task: noTagGroup });
    }

    return result;
  };

  console.log(groupBy(allEvents));

  // 데이터 없으면 로딩 표시
  if (allEvents.length === 0) {
    return (
      <div className="text-center mt-10">데이터 로딩 중...</div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {groupBy(allEvents).map((group, index) => (
          <TagItem key={index} eventsList={group} />
        ))}
      </div>
    </div>
  );
};

export default Tag;
