import baseAxiosInstance from "./baseAxiosApi";

const deleteTag = async (tagId) => {
  const typeCeck = typeof tagId;

  try {
    const response = await baseAxiosInstance.delete(
      `/schedules/tags/${tagId}/`
    );

    return response;
  } catch (error) {
    console.error("error", error);
  }
};

export default deleteTag;
