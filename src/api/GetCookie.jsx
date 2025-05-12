import axios from "axios";

const GetCookie = async () => {
  try {
    const response = await axios.post(
      "http://13.124.140.60/users/login/",
      {
        email: "hyjoo0909@naver.com",
        password: "0909",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 서버에서 받은 응답을 처리

    // 쿠키 확인 (access, refresh)
    console.log("GetCookie token :", response.data);
    return response.data;
  } catch (error) {
    console.error("백엔드 오류:", error);
    return null; // 오류 발생 시 null 반환
  }
};

export default GetCookie;
