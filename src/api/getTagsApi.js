import baseAxiosInstance from "./baseAxiosApi";

const getTags = async () => {
  try {
    const response = await baseAxiosInstance.get(
      `/schedules/tags/`
    );

    // 태그 이름과 색상 정보를 모두 가져옴
    const tagNames = response.data.map((tag) => ({
      value: tag.name,
      label: tag.name,
      color: tag.color || "#526D82", // 색상 정보도 함께 저장, 없으면 기본 색상 사용
    }));

    console.log("가져온 태그 목록:", tagNames);
    return tagNames;
  } catch (error) {
    console.error("태그 가져오기 오류", error);
    return []; // 오류 시 빈 배열 반환
  }
};

export default getTags;
