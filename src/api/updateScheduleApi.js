import baseAxiosInstance from "./baseAxiosApi";

const updateSchedules = async (data) => {
  try {
    let tags = [];

    if (data.tag && Array.isArray(data.tag)) {
      tags = data.tag.map((tag) => tag.label || tag);
    } else if (data.tagName) {
      if (
        typeof data.tagName === "string" &&
        data.tagName.includes(",")
      ) {
        tags = data.tagName.split(",").map((tag) => tag.trim());
      } else if (
        typeof data.tagName === "string" &&
        data.tagName.trim() !== ""
      ) {
        tags = [data.tagName.trim()];
      } else if (Array.isArray(data.tagName)) {
        tags = data.tagName.filter(
          (tag) => tag && tag.trim() !== ""
        );
      }
    }

    const response = await baseAxiosInstance.put(
      `/schedules/${data.id}/`,
      {
        title: data.title,
        content: data.content || null,
        scheduled_date: data.date,
        tag: tags,
        deadline: data.deadline,
        is_completed: data.is_completed || data.completed,
      }
    );

    return response.data;
  } catch (error) {
    console.error("일정 업데이트 에러:", error);
    throw error;
  }
};

export default updateSchedules;
