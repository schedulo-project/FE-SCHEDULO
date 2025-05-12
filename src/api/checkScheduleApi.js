// 일정 조회 api
import GetCookie from "./GetCookie";
import axios from "axios";

const fetchSchedules = async (firstDate, lastDate) => {
  const Logindata = await GetCookie();
  const token = Logindata.access;

  try {
    const response = await axios.get(
      `http://13.124.140.60/schedules/list/`,
      {
        params: {
          first: firstDate,
          last: lastDate,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("순수한 서버 데이터", response.data);

    // API 응답 데이터를 events 형식으로 변환
    return Object.entries(response.data.schedules).flatMap(
      ([date, schedules]) =>
        schedules.map((schedule) => ({
          id: schedule.id,
          title: schedule.title || "제목 없음", // 일정의 제목 설정 (없으면 "제목 없음")
          tagName: schedule.tag
            .map((tag) => tag.name)
            .join(", "), // 태그 이름 합치기
          date: date, // 날짜 설정
          is_completed: schedule.is_completed,
          content: schedule.content || "", // content 추가 (없으면 빈 문자열)
          deadline: schedule.deadline || null, // deadline 추가 (없으면 null)
        }))
    );
  } catch (error) {
    console.error("Error fetching schedules", error);
    throw error;
  }
};

export default fetchSchedules;
