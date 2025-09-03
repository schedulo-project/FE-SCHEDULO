import baseAxiosInstance from "./baseAxiosApi";

const putTag = async (tag, tagId) => {
  const typeCeck = typeof tagId;
  console.log("putTag", tag, tagId);

  try {
    const response = await baseAxiosInstance.put(`/schedules/tags/${tagId}/`, {
      name: tag,
    });

    console.log(response);
    return response;
  } catch (error) {
    console.error("error", error);
  }
};

export default putTag;
