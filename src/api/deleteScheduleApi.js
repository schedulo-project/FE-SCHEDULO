import baseAxiosInstance from "./baseAxiosApi";

const deleteSchedules = async (id) => {
  try {
    const response = await baseAxiosInstance.delete(
      `/schedules/${id}/`
    );
  } catch (error) {
    console.error("Error fetching schedules", error);
    throw error;
  }
};

export default deleteSchedules;
