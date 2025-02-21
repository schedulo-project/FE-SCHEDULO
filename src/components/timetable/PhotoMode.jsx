import { useState } from "react";
import Tesseract from "tesseract.js";

const PhotoMode = ({ onSubmit }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!image) return alert("이미지를 업로드하세요!");

    setLoading(true);
    try {
      // 1) Tesseract.js를 사용하여 이미지 OCR
      const {
        data: { text },
      } = await Tesseract.recognize(image, "kor");
      console.log("OCR 결과 텍스트:", text);

      // 2) OCR 결과 텍스트 파싱 → 시간표 데이터로 변환
      const analyzedData = parseTimeTable(text);
      onSubmit(analyzedData);
    } catch (error) {
      console.error("OCR 에러:", error);
      alert("OCR 분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * OCR 결과 텍스트를 분석해
   * { name, professor, day, startHour, endHour, location } 형태 배열로 반환
   */
  const parseTimeTable = (ocrText) => {
    // 예시: OCR에서 아래처럼 인식했다고 가정 (실제 포맷은 달라질 수 있음)
    // "월요일 9:00~11:00 캡스톤디자인 한혁수 G201\n금요일 10:00~12:00 바이오아트 오재훈 Z200\n ..."
    // 이 텍스트를 줄단위로 split하여, 각 줄을 파싱하는 로직

    const lines = ocrText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const result = [];

    lines.forEach((line) => {
      // 예: "월요일 9:00~11:00 캡스톤디자인 한혁수 G201"
      // 단순 정규식 예시 (실제 프로젝트에서 세부 조정 필요)
      const regex =
        /(?<day>월요일|화요일|수요일|목요일|금요일|토요일)\s+(?<start>\d{1,2}:\d{2})~(?<end>\d{1,2}:\d{2})\s+(?<name>\S+)\s+(?<professor>\S+)\s+(?<location>\S+)/;
      const match = line.match(regex);

      if (match) {
        const { day, start, end, name, professor, location } = match.groups;
        // 시간 "9:00" → 숫자 9 로 변환
        const startHour = parseInt(start.split(":")[0], 10);
        const endHour = parseInt(end.split(":")[0], 10);

        result.push({
          day,
          name,
          professor,
          location,
          startHour,
          endHour,
        });
      }
    });

    return result;
  };

  return (
    <div>
      <h2>사진으로 시간표 등록</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {preview && (
        <div className="mt-2">
          <img src={preview} alt="Preview" style={{ width: "100%", maxWidth: 400 }} />
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "분석 중..." : "분석하기"}
      </button>
    </div>
  );
};

export default PhotoMode;
