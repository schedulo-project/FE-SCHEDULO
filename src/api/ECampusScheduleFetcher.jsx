import axios from "axios";
import GetCookie from "./GetCookie";

const fetchECampusSchedule = async () => {
  try {
    const loginResult = await GetCookie();
    if (!loginResult || !loginResult.access) {
      throw new Error("로그인 실패");
    }

    const token = loginResult.access;

    const response = await axios.get("http://schedulo.store/users/crawling/", {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { courses } = response.data;
    console.log("크롤링 데이터", courses);
    return { courses };
  } catch (error) {
    console.error("ECampus 일정 불러오기 실패:", error);
    return null;
  }
};

export default fetchECampusSchedule;
