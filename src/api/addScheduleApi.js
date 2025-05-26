import axios from "axios";
import GetCookie from "./GetCookie";

const addSchedules = async (data) => {
  const Logindata = await GetCookie();
  const token = Logindata.access;
  console.log(data);

  try {
    const response = await axios.post(
      `http://13.124.140.60/schedules/`,
      {
        title: data.title,
        content: data.content,
        scheduled_date: data.date,
        tag: data.selectedTags,
        deadline: data.date,
        id_completed: data.completed,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error", error);
  }
};

export default addSchedules;
