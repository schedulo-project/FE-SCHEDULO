import axios from "axios";
import GetCookie from "./GetCookie";

const getScores = async () => {
  const Logindata = await GetCookie();
  const token = Logindata.access;

  try {
    const response = await axios.get(
      `http://13.124.140.60/users/scores/`,

      {
        params: {
          mock: true,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export default getScores;
