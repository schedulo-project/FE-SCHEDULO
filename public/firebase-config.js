import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
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

// 크로스 플랫폼 지원 확인
async function checkPlatformSupport() {
  // FCM 지원 여부 확인
  const fcmSupported = await isSupported();
  if (!fcmSupported) {
    console.warn("⚠️ 이 브라우저는 FCM을 지원하지 않습니다");
    return false;
  }

  // 서비스 워커 지원 확인
  if (!("serviceWorker" in navigator)) {
    console.warn(
      "⚠️ 이 브라우저는 서비스 워커를 지원하지 않습니다"
    );
    return false;
  }

  // 알림 지원 확인
  if (!("Notification" in window)) {
    console.warn("⚠️ 이 브라우저는 알림을 지원하지 않습니다");
    return false;
  }

  return true;
}

// 플랫폼별 최적화된 설정
function getPlatformSpecificSettings() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMac = userAgent.includes("mac");
  const isWindows = userAgent.includes("windows");
  const isSafari =
    userAgent.includes("safari") &&
    !userAgent.includes("chrome");

  return {
    isMac,
    isWindows,
    isSafari,
    // Safari에서는 PWA 설치가 필요할 수 있음
    requiresPWA: isSafari && isMac,
  };
}

// FCM 토큰 발급 및 서버 전송
async function initializeFCM() {
  try {
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    // 서비스 워커 등록
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log("서비스 워커 등록 완료");

    // FCM 토큰 발급
    const fcmToken = await getToken(messaging, {
      vapidKey:
        "BMU5BcnV9tGciycCXXPQdwB1Xq2hEp1yjU8jIaGcAogmhGWLvGBFaZOia3NEGtjcxzPqGz7vB1gu_QjcH8Br7CM",
      serviceWorkerRegistration: registration,
    });

    if (!fcmToken) {
      throw new Error("FCM 토큰 발급 실패");
    }

    console.log("FCM 토큰 발급 완료:", fcmToken);

    // 서버에 토큰 전송
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("액세스 토큰이 없습니다");
    }

    console.log(
      "🔑 액세스 토큰 확인:",
      accessToken.substring(0, 20) + "..."
    );
    console.log("📤 서버에 FCM 토큰 전송 시작...");

    const response = await fetch("/notifications/fcm-token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        fcm_token: fcmToken,
        platform: getPlatformSpecificSettings(),
      }),
    });

    console.log("📥 서버 응답 상태:", response.status);

    // 헤더 정보를 안전하게 출력
    try {
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log("📥 서버 응답 헤더:", headers);
    } catch (e) {
      console.log("📥 헤더 정보 출력 실패:", e.message);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 서버 응답 오류:", errorText);
      throw new Error(
        `서버 응답 오류: ${response.status} - ${errorText}`
      );
    }

    const responseData = await response.json();
    console.log("✅ 서버 응답 데이터:", responseData);
    console.log("✅ 서버에 FCM 토큰 전송 완료");
    return { messaging, fcmToken };
  } catch (error) {
    console.error("❌ FCM 초기화 실패:", error.message);
    throw error;
  }
}

// 포그라운드 메시지 처리
function setupForegroundMessageHandler(messaging) {
  onMessage(messaging, (payload) => {
    console.log("🔔 포그라운드 메시지 수신:", payload);

    const notificationTitle =
      payload.data?.content_title ||
      payload.notification?.title ||
      "새 알림";
    const notificationBody =
      payload.data?.body ||
      payload.notification?.body ||
      "메시지가 도착했습니다";
    const notificationUrl = payload.data?.url || "/";

    // 데스크톱 알림 표시
    if (Notification.permission === "granted") {
      const notification = new Notification(notificationTitle, {
        body: notificationBody,
        icon: "/static/icon-192x192.png", // 아이콘 경로 설정 필요
        badge: "/static/badge-72x72.png", // 배지 경로 설정 필요
        data: { url: notificationUrl },
      });

      // 알림 클릭 이벤트
      notification.onclick = function () {
        window.focus();
        window.location.href = notificationUrl;
        notification.close();
      };
    }
  });
}

// 메인 초기화 함수
async function initializeNotifications() {
  try {
    // 플랫폼 지원 확인
    const isSupported = await checkPlatformSupport();
    if (!isSupported) {
      console.warn(
        "이 브라우저에서는 알림 기능을 사용할 수 없습니다"
      );
      return;
    }

    // 플랫폼별 설정 확인
    const platformInfo = getPlatformSpecificSettings();
    console.log("🌐 플랫폼 정보:", platformInfo);

    // 알림 권한 요청
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("❌ 알림 권한이 거부되었습니다");
      return;
    }

    // FCM 초기화
    const { messaging } = await initializeFCM();

    // 포그라운드 메시지 핸들러 설정
    setupForegroundMessageHandler(messaging);

    console.log("🎉 알림 시스템 초기화 완료!");
  } catch (error) {
    console.error("❌ 알림 시스템 초기화 실패:", error.message);
  }
}

// DOM 로드 완료 후 초기화
document.addEventListener(
  "DOMContentLoaded",
  initializeNotifications
);

// 수동 초기화 함수 (외부에서 호출 가능)
window.initializeNotifications = initializeNotifications;

// 플랫폼 정보 확인 함수 (외부에서 호출 가능)
window.getPlatformInfo = getPlatformSpecificSettings;

async function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat(
    (4 - (base64String.length % 4)) % 4
  );
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i)
    outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export async function enableWebPush(
  vapidPublicKey = "BMU5BcnV9tGciycCXXPQdwB1Xq2hEp1yjU8jIaGcAogmhGWLvGBFaZOia3NEGtjcxzPqGz7vB1gu_QjcH8Br7CM"
) {
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    throw new Error(
      "이 브라우저는 웹 푸시를 지원하지 않습니다."
    );
  }

  // iOS Safari: must be installed to Home Screen (PWA) to request permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("알림 권한이 거부되었습니다.");
  }

  // Register service worker
  const registration = await navigator.serviceWorker.register(
    "/sw.js"
  );

  // Subscribe
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: await urlBase64ToUint8Array(
      vapidPublicKey
    ),
  });

  // Send subscription JSON to your server
  const res = await fetch("/api/push/subscribe/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error("구독 저장 실패: " + txt);
  }
  return true;
}

// Optional helper: simple Safari detection
export function isSafariLike() {
  const ua = navigator.userAgent.toLowerCase();
  const isSafari =
    ua.includes("safari") &&
    !ua.includes("chrome") &&
    !ua.includes("crios") &&
    !ua.includes("fxios");
  return isSafari;
}
