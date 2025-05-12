const GetCookie = async () => {
  try {
    const response = await fetch(
      "http://13.124.140.60/users/login/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "hyjoo0909@naver.com",
          password: "0909",
        }), // ExData를 서버로 전송
      }
    );

    const data = await response.json();
    // 서버에서 받은 응답을 처리
    console.log("GetCookie token :", data);
    return data;
  } catch (error) {
    console.error("백엔드 오류:", error);
    return null; // 오류 발생 시 null 반환
  }
};

export default GetCookie;
