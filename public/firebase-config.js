import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging.js";
const baseURL = import.meta.env.VITE_API_BASE_URL;
const apiURL = import.meta.env.VITE_API_KEY;
const authDomain = import.meta.env.VITE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env
  .VITE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_APP_ID;
const measurementId = import.meta.env.VITE_MEASUREMENT_ID;
const vapidKey = import.meta.env.VITE_VAPID_KEY;

const firebaseConfig = {
  apiKey: apiURL,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
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
    // 로그인 상태 확인
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("로그인 상태가 아닙니다");
    }

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    // 서비스 워커 등록 및 준비 완료 확인
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log("서비스 워커 등록 완료");

    // 서비스 워커가 활성화될 때까지 대기
    if (registration.installing || registration.waiting) {
      console.log(
        "서비스 워커 설치 또는 대기 중... 활성화 대기"
      );
      await new Promise((resolve) => {
        function onStateChange() {
          if (registration.active) {
            console.log("✅ 서비스 워커가 활성화되었습니다.");
            registration.removeEventListener(
              "statechange",
              onStateChange
            );
            resolve();
          }
        }
        registration.addEventListener(
          "statechange",
          onStateChange
        );

        // 10초 후에도 활성화되지 않으면 진행
        setTimeout(() => {
          registration.removeEventListener(
            "statechange",
            onStateChange
          );
          console.warn(
            "⚠️ 서비스 워커 활성화 타임아웃. 계속 진행합니다."
          );
          resolve();
        }, 10000);
      });
    } else if (registration.active) {
      console.log("✅ 서비스 워커가 이미 활성화되어 있습니다.");
    }

    // FCM 토큰 발급 시도
    const fcmToken = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!fcmToken) {
      throw new Error("FCM 토큰 발급 실패");
    }

    console.log("FCM 토큰 발급 완료:", fcmToken);

    console.log(
      "🔑 액세스 토큰 확인:",
      accessToken.substring(0, 20) + "..."
    );
    console.log("📤 서버에 FCM 토큰 전송 시작...");

    const response = await fetch(
      `${baseURL}/notifications/fcm-token/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          fcm_token: fcmToken,
          platform: getPlatformSpecificSettings(),
        }),
      }
    );

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
export async function initializeNotifications() {
  try {
    // 로그인 확인 - accessToken이 있어야 알림 초기화 진행
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.log(
        "⚠️ 로그인 상태가 아닙니다. 알림 초기화를 건너뜁니다."
      );
      return;
    }

    console.log("✅ 로그인 확인됨: 알림 초기화 진행합니다");

    // 플랫폼 지원 확인
    const isSupported = await checkPlatformSupport();
    if (!isSupported) {
      console.warn(
        "⚠️ 이 브라우저에서는 알림 기능을 사용할 수 없습니다"
      );
      return;
    }

    // 플랫폼별 설정 확인
    const platformInfo = getPlatformSpecificSettings();
    console.log("🌐 플랫폼 정보:", platformInfo);

    // 서비스 워커 등록 상태 확인
    if ("serviceWorker" in navigator) {
      const registrations =
        await navigator.serviceWorker.getRegistrations();
      console.log(
        `📋 현재 등록된 서비스 워커: ${registrations.length}개`
      );

      for (const reg of registrations) {
        console.log(
          `서비스 워커 범위: ${reg.scope}, 상태: ${
            reg.active ? "활성화" : "비활성화"
          }`
        );
      }
    }

    // 알림 권한 요청
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("❌ 알림 권한이 거부되었습니다");
      return;
    }

    try {
      // FCM 초기화 시도
      const { messaging } = await initializeFCM();

      // 포그라운드 메시지 핸들러 설정
      setupForegroundMessageHandler(messaging);

      console.log("🎉 알림 시스템 초기화 완료!");
    } catch (fcmError) {
      console.error("❌ FCM 초기화 실패:", fcmError.message);

      // FCM 초기화 실패 시 웹 푸시 대체 방법 시도
      console.log("💡 웹 푸시 방식으로 재시도 중...");
      try {
        await enableWebPush(vapidKey);
        console.log("✅ 웹 푸시 구독 성공!");
      } catch (pushError) {
        console.error(
          "❌ 웹 푸시 구독 실패:",
          pushError.message
        );
        throw new Error(
          `알림 시스템 초기화 실패: ${pushError.message}`
        );
      }
    }
  } catch (error) {
    console.error("❌ 알림 시스템 초기화 실패:", error.message);

    // 디버깅을 위한 추가 정보
    if ("serviceWorker" in navigator) {
      try {
        const registrations =
          await navigator.serviceWorker.getRegistrations();
        console.log(
          `🔍 디버그 정보 - 등록된 서비스 워커: ${registrations.length}개`
        );

        // 각 서비스 워커 상세 정보 출력
        registrations.forEach((reg, idx) => {
          console.log(
            `${idx + 1}. 서비스 워커 범위: ${reg.scope}`
          );
          console.log(
            `   상태: ${
              reg.installing
                ? "설치 중"
                : reg.waiting
                ? "대기 중"
                : reg.active
                ? "활성화"
                : "알 수 없음"
            }`
          );
        });
      } catch (swError) {
        console.error("서비스 워커 정보 확인 실패:", swError);
      }
    }

    throw error;
  }
}

// 수동 초기화 함수 (외부에서 호출 가능)
window.initializeNotifications = initializeNotifications;

// 플랫폼 정보 확인 함수 (외부에서 호출 가능)
export const getPlatformInfo = getPlatformSpecificSettings;

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

  // 서비스 워커 등록 - firebase-messaging-sw.js로 경로 통일
  let registration;
  try {
    // 이미 등록된 서비스 워커 확인
    registration = await navigator.serviceWorker.getRegistration(
      "/firebase-messaging-sw.js"
    );

    if (!registration) {
      console.log("새로운 서비스 워커 등록 시도");
      registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
    }

    // 서비스 워커 활성화 대기
    if (registration.installing || registration.waiting) {
      console.log("서비스 워커 활성화 대기 중...");
      await new Promise((resolve) => {
        const worker =
          registration.installing || registration.waiting;
        worker.addEventListener("statechange", () => {
          if (worker.state === "activated") {
            console.log("서비스 워커 활성화됨");
            resolve();
          }
        });
      });
    }
  } catch (error) {
    console.error("서비스 워커 등록 실패:", error);
    throw new Error(`서비스 워커 등록 실패: ${error.message}`);
  }

  // 서비스 워커 활성화 확인
  if (!registration.active) {
    throw new Error("서비스 워커가 활성화되지 않았습니다.");
  }

  // Subscribe
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: await urlBase64ToUint8Array(
      vapidPublicKey
    ),
  });

  // Send subscription JSON to your server
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("로그인 상태가 아닙니다");
  }

  // 기존 API 경로가 아닌 baseURL을 활용하여 정확한 백엔드 API에 연결
  const res = await fetch(
    `${baseURL}/notifications/web-push-subscribe/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        subscription: subscription,
        platform: getPlatformSpecificSettings(),
      }),
    }
  );

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
