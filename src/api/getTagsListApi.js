import baseAxiosInstance from "./baseAxiosApi";

//태그 id 값도 필요해서 만듬
const getTagList = async () => {
  try {
    const response = await baseAxiosInstance.get(`/schedules/tags/`);

    const tagNames = response.data;

    return tagNames;
  } catch (error) {
    console.error("error", error);
  }
};

export default getTagList;
