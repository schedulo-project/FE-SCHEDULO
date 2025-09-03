import baseAxiosInstance from "./baseAxiosApi";

const updateSchedules = async (data) => {
  try {
    const response = await baseAxiosInstance.put(`/schedules/${data.id}/`, {
      title: data.title,
      content: data.content,
      scheduled_date: data.date,
      tag: data.tag.map((t) => t.value),
      deadline: data.deadline,
      is_completed: data.completed,
    });
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export default updateSchedules;
