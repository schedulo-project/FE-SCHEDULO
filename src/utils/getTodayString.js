// 오늘 날짜 반환 로직
export default function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}
