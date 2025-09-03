import baseAxiosInstance from "./baseAxiosApi";

//--------------------알림--------------------
// 알림 on/off
export async function alarmToggle({ today, deadline }) {
  const res = await baseAxiosInstance.patch(
    "/notifications/noti-setting/",
    {
      notify_today_schedule: today,
      notify_deadline_schedule: deadline,
    }
  );
  return res.data;
}

// 알림 세팅 조회
export async function getAlarmState() {
  const res = await baseAxiosInstance.get(
    "/notifications/noti-setting/"
  );
  return res.data;
}

//--------------------시각화--------------------
// 사용자 점수 조회
export async function getScores() {
  const res = await baseAxiosInstance.get("/users/scores/");
  return res.data;
}

//--------------------프로필--------------------
//비밀번호 확인
export async function checkCurrentPassword({ currentPassword }) {
  const res = await baseAxiosInstance.post("/users/pw/check/", {
    current_password: currentPassword,
  });
  return res.data;
}

//비밀번호 변경
export async function changePassword({ newPassword }) {
  const res = await baseAxiosInstance.post("/users/pw/update/", {
    new_password: newPassword,
  });
  return res.data;
}

//샘물 정보 수정
export async function changeSamwater({
  samwaterId,
  samwaterPassword,
}) {
  const res = await baseAxiosInstance.post(
    `/users/smul-update/`,
    {
      student_id: samwaterId,
      student_password: samwaterPassword,
    }
  );
  return res.data;
}

//회원 탈퇴
export async function deleteUser() {
  const res = await baseAxiosInstance.delete("/users/");
  return res.data;
}
