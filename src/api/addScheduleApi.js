import baseAxiosInstance from "./baseAxiosApi";

const addSchedules = async (data) => {
  const tag = data.selectedTags.map((tag) => tag.label);

  try {
    const response = await baseAxiosInstance.post(`/schedules/`, {
      title: data.title,
      content: data.content,
      scheduled_date: data.date,
      tag: tag,
      deadline: data.deadline,
      is_completed: data.completed,
    });
    console.log("response", response);
    return response;
  } catch (error) {
    if (error.response) {
      // 서버 응답이 있는 경우
      console.error("Server Error:", error.response.data);
    } else {
      // 서버 응답이 없는 경우
      console.error("Network Error:", error.message);
    }
    throw error; // 에러를 호출한 쪽에서 처리할 수 있도록 던짐
  }
};

export default addSchedules;
