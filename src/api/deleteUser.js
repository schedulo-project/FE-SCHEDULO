import axios from "axios";
import GetCookie from "./GetCookie";

const deleteUser = async () => {
  const Logindata = await GetCookie();
  const token = Logindata.access;

  try {
    const response = await axios.delete(
      `https://schedulo.store/users/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);
    return response;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export default deleteUser;
