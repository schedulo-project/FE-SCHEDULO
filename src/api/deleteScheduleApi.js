import axios from "axios";
import GetCookie from "./GetCookie";

const deleteSchedules = async (id) => {
  const Logindata = await GetCookie();
  const token = Logindata.access;

  console.log("토큰:", token);
  console.log("id", id);
  try {
    const response = await axios.delete(
      `https://schedulo.store/schedules/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("delete response : ", response.data);
    console.log("제거 성공(api)");
  } catch (error) {
    console.error("Error fetching schedules", error);
    throw error;
  }
};

export default deleteSchedules;
