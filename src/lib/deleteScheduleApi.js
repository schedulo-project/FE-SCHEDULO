import GetCookie from "./GetCookie";

const deleteSchedules = async (id) => {
  const Logindata = await GetCookie();
  const token = Logindata.access;

  console.log("토큰:", token);
  console.log("id", id);
  try {
    const response = await fetch(
      `http://13.124.140.60/schedules/${id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch schedules");
    }
    console.log("delete response", response);
    console.log("제거 성공(api)");
  } catch (error) {
    console.error("Error fetching schedules", error);
    throw error;
  }
};

export default deleteSchedules;
