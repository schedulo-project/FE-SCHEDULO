import baseAxiosInstance from "./baseAxiosApi";

const fetchECampusSchedule = async (token) => {
  try {
    const response = await baseAxiosInstance.get(
      "/users/crawling/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { courses } = response.data;
    console.log("크롤링 데이터", courses);
    return { courses };
  } catch (error) {
    console.error("ECampus 일정 불러오기 실패:", error);
    return { courses: null, error: error.message };
  }
};

export default fetchECampusSchedule;
