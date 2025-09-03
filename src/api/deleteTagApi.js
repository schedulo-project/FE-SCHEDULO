import baseAxiosInstance from "./baseAxiosApi";

const deleteTag = async (tagId) => {
  const typeCeck = typeof tagId;
  console.log("putTag", tagId);

  try {
    const response = await baseAxiosInstance.delete(
      `/schedules/tags/${tagId}/`
    );

    console.log(response);
    return response;
  } catch (error) {
    console.error("error", error);
  }
};

export default deleteTag;
