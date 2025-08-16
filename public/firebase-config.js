import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyDOzoBP7qcGVls9-4rmv5WyyryBYO-KsWY",
  authDomain: "schedulo-dde70.firebaseapp.com",
  projectId: "schedulo-dde70",
  storageBucket: "schedulo-dde70.firebasestorage.app",
  messagingSenderId: "815568684185",
  appId: "1:815568684185:web:7a3d409b5b124010072408",
  measurementId: "G-V91N35KCFS",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

document.addEventListener("DOMContentLoaded", async function () {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("❌ 알림 권한 거부됨");
    return;
  }
  // let fcmToken = null;

  try {
    // 서비스 워커 등록
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log("서비스 워커 등록 완료");

    // await navigator.serviceWorker.ready;

    const fcmToken = await getToken(messaging, {
      // VAPID Key -> fcmToken 발급
      vapidKey:
        "BMU5BcnV9tGciycCXXPQdwB1Xq2hEp1yjU8jIaGcAogmhGWLvGBFaZOia3NEGtjcxzPqGz7vB1gu_QjcH8Br7CM",
      serviceWorkerRegistration: registration,
    });

    if (!fcmToken) {
      console.error("❌ FCM 토큰 발급 실패");
      return;
    }

    console.log("발급된 FCM 토큰:", fcmToken);

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.error("❌ access token 누락");
      return;
    }

    // FCM 토큰을 서버로 전송
    const res = await fetch("/notifications/fcm-token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ fcm_token: fcmToken }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error("응답 오류: " + errorText);
    }

    console.log("서버에 토큰 전송 완료");
  } catch (err) {
    console.error("❌ 오류 발생", err.message);
  }
});

//브라우저 탭이 열려 있을 때 메시지 수신
onMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js]🔔 포그라운드 메시지 수신:",
    payload
  );

  const notificationTitle = payload.data.content_title || "알림";
  const notificationOptions = {
    body: payload.data.body || "메시지가 도착했습니다.",
  };

  if (Notification.permission !== "granted") {
    navigator.serviceWorker
      .getRegistration()
      .then((registration) => {
        if (registration) {
          registration.showNotification(
            notificationTitle,
            notificationOptions
          );
        }
      });
  }

  // 현재 탭에 표시
  new Notification(notificationTitle, notificationOptions);
});
