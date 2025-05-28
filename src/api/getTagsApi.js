import axios from "axios";
import GetCookie from "./GetCookie";

const getTags = async () => {
  const Logindata = await GetCookie();
  const token = Logindata.access;

  try {
    const response = await axios.get(
      `http://13.124.140.60/schedules/tags/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("res", response.data);
  } catch (error) {
    console.error("error", error);
  }
};

export default getTags;
