import axios from "axios";
import GetCookie from "./GetCookie";

const deleteTag = async (tagId) => {
  const Logindata = await GetCookie();
  const token = Logindata.access;
  const typeCeck = typeof tagId;
  console.log("putTag", tagId);

  try {
    const response = await axios.delete(
      `http://13.124.140.60/schedules/tags/${tagId}/`,
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

export default deleteTag;
