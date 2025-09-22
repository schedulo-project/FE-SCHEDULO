import baseAxiosInstance from "./baseAxiosApi";

const updateSchedules = async (data) => {
  try {
    const response = await baseAxiosInstance.put(`/schedules/${data.id}/`, {
      title: data.title,
      content: data.content,
      scheduled_date: data.date,
      tag: data.tagName ? [data.tagName] : [],
      deadline: data.deadline,
      is_completed: data.is_completed,
    });
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error; // 에러를 다시 던져서 Calendar에서 처리할 수 있도록 함
  }
};

export default updateSchedules;
