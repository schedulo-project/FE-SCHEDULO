import baseAxiosInstance from "./baseAxiosApi";

const updateSchedules = async (data) => {
  try {
    console.log("업데이트 요청 데이터:", data); // 디버깅용

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
        content: data.content,
        scheduled_date: data.date,
        tag: tags,
        deadline: data.deadline,
        is_completed: data.is_completed || data.completed, // is_completed 또는 completed 필드 사용
      }
    );

    return response.data;
  } catch (error) {
    console.error("일정 업데이트 에러:", error);
    throw error; // 에러를 다시 던져서 Calendar에서 처리할 수 있도록 함
  }
};

export default updateSchedules;
