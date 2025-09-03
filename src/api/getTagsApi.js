import baseAxiosInstance from "./baseAxiosApi";

const getTags = async () => {
  try {
    const response = await baseAxiosInstance.get(`/schedules/tags/`);

    const tagNames = response.data
      .map((tag) => tag.name)
      .map((name) => ({
        value: name,
        label: name,
      }));

    return tagNames;
  } catch (error) {
    console.error("error", error);
  }
};

export default getTags;
