importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js"
);

// Firebase 초기화
firebase.initializeApp({
  apiKey: "AIzaSyDOzoBP7qcGVls9-4rmv5WyyryBYO-KsWY",
  authDomain: "schedulo-dde70.firebaseapp.com",
  projectId: "schedulo-dde70",
  storageBucket: "schedulo-dde70.firebasestorage.app",
  messagingSenderId: "815568684185",
  appId: "1:815568684185:web:7a3d409b5b124010072408",
  measurementId: "G-V91N35KCFS",
});

const messaging = firebase.messaging();

// 백그라운드 메시지 처리 (탭이 닫혀있거나 백그라운드일 때)
messaging.onBackgroundMessage((payload) => {
  console.log("🔔 백그라운드 메시지 수신", payload);

  // 플랫폼별 최적화된 알림 옵션
  const notificationTitle =
    payload.data?.content_title ||
    payload.notification?.title ||
    "새 알림";
  const notificationBody =
    payload.data?.body ||
    payload.notification?.body ||
    "메시지가 도착했습니다";
  const notificationUrl = payload.data?.url || "/";

  // 크로스 플랫폼 호환성을 위한 알림 옵션
  const notificationOptions = {
    body: notificationBody,
    tag: "fcm-notification", // 중복 알림 방지
    requireInteraction: false, // 자동으로 사라지도록
    data: {
      url: notificationUrl,
      timestamp: Date.now(),
    },
    // Windows와 Mac에서 모두 작동하는 액션
    actions: [
      {
        action: "open",
        title: "열기",
        icon: "/static/icon-72x72.png",
      },
      {
        action: "close",
        title: "닫기",
      },
    ],
  };

  // 알림 표시
  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// 알림 클릭 이벤트 처리
self.addEventListener("notificationclick", function (event) {
  console.log("🔔 알림 클릭됨:", event.notification.data);

  event.notification.close();

  const url = event.notification.data?.url || "/";

  // 클릭된 액션에 따른 처리
  if (event.action === "close") {
    return; // 아무것도 하지 않음
  }

  // 기본 동작: URL 열기
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        // 이미 열린 탭이 있는지 확인
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }

        // 새 탭 열기
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// 알림 닫기 이벤트 처리
self.addEventListener("notificationclose", function (event) {
  console.log("🔔 알림 닫힘:", event.notification.data);

  // 필요한 경우 서버에 알림 상태 업데이트
  const notificationData = event.notification.data;
  if (notificationData) {
    // 서버에 알림 상태 업데이트 로직 (선택사항)
    console.log("알림이 닫힘:", notificationData);
  }
});

// 서비스 워커 설치 이벤트
self.addEventListener("install", function (event) {
  console.log("✅ 서비스 워커 설치됨");
  self.skipWaiting();
});

// 서비스 워커 활성화 이벤트
self.addEventListener("activate", function (event) {
  console.log("✅ 서비스 워커 활성화됨");
  event.waitUntil(self.clients.claim());
});

// 메시지 이벤트 처리 (일반적인 서비스 워커 메시지)
self.addEventListener("message", function (event) {
  console.log("📨 서비스 워커 메시지 수신:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
