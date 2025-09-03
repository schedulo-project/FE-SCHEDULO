import baseAxiosInstance from "./baseAxiosApi";

const deleteSchedules = async (id) => {
  console.log("id", id);
  try {
    const response = await baseAxiosInstance.delete(`/schedules/${id}/`);

    console.log("delete response : ", response.data);
    console.log("제거 성공(api)");
  } catch (error) {
    console.error("Error fetching schedules", error);
    throw error;
  }
};

export default deleteSchedules;
