import axios from "axios";
import GetCookie from "./GetCookie";

//태그 id 값도 필요해서 만듬
const getTagList = async () => {
  const Logindata = await GetCookie();
  const token = Logindata.access;

  try {
    const response = await axios.get(
      `https://schedulo.store/schedules/tags/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const tagNames = response.data;

    return tagNames;
  } catch (error) {
    console.error("error", error);
  }
};

export default getTagList;
