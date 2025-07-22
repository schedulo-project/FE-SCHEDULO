import axios from "axios";
import GetCookie from "./GetCookie";

const putTag = async (tag, tagId) => {
  const Logindata = await GetCookie();
  const token = Logindata.access;
  const typeCeck = typeof tagId;
  console.log("putTag", tag, tagId);

  try {
    const response = await axios.put(
      `https://schedulo.store/schedules/tags/${tagId}/`,
      {
        name: tag,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);
    return response;
  } catch (error) {
    console.error("error", error);
  }
};

export default putTag;
