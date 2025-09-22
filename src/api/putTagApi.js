import baseAxiosInstance from "./baseAxiosApi";

const putTag = async (tag, tagId) => {
  const typeCeck = typeof tagId;

  try {
    const response = await baseAxiosInstance.put(
      `/schedules/tags/${tagId}/`,
      {
        name: tag,
      }
    );
    return response;
  } catch (error) {
    console.error("error", error);
  }
};

export default putTag;
