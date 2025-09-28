import baseAxiosInstance from "./baseAxiosApi";

const fetchSchedules = async (firstDate, lastDate) => {
  try {
    const response = await baseAxiosInstance.get(
      `/schedules/list/`,
      {
        params: {
          first: firstDate,
          last: lastDate,
        },
      }
    );

    const schedulesData = response.data?.schedules ?? {};

    return Object.entries(schedulesData).flatMap(
      ([date, schedules]) =>
        (schedules ?? []).map((schedule) => ({
          id: schedule.id,
          title: schedule.title || "제목 없음",
          tagName: (schedule.tag ?? [])
            .map((tag) => tag.name)
            .join(", "),
          tagColor: (schedule.tag ?? [])
            .map((tag) => tag.color)
            .join(", "),
          date: date,
          is_completed: schedule.is_completed,
          content: schedule.content || null,
          deadline: schedule.deadline || null,
        }))
    );
  } catch (error) {
    console.error("Error fetching schedules", error);
    throw error;
  }
};

export default fetchSchedules;
