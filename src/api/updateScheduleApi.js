import GetCookie from "./GetCookie";
import axios from "axios";

const updateSchedules = async (data) => {
  const Logindata = await GetCookie();
  const token = Logindata.access;

  try {
    const response = await axios.put(
      `https://schedulo.store/schedules/${data.id}/`,
      {
        title: data.title,
        content: data.content,
        scheduled_date: data.date,
        tag: data.tag.map((t) => t.value),
        deadline: data.date,
        is_completed: data.completed,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export default updateSchedules;
