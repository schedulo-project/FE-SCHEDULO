import baseAxiosInstance from "./baseAxiosApi";

const getTags = async () => {
  try {
    const response = await baseAxiosInstance.get(
      `/schedules/tags/`
    );

    const tagNames = response.data.map((tag) => ({
      value: tag.name,
      label: tag.name,
      color: tag.color || "#EDEDED",
    }));

    return tagNames;
  } catch (error) {
    console.error("태그 가져오기 오류", error);
    return [];
  }
};

export default getTags;
