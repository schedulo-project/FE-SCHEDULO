importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js"
);

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

// 탭 닫혀있거나 백그라운드일 때 메시지 수신(서비스 워커에서 처리)
messaging.onBackgroundMessage((payload) => {
  console.log("🔔 백그라운드 메시지 수신", payload);
  const notificationTitle = payload.data.content_title || "알림";
  const notificationOptions = {
    body: payload.data.body || "",
    url: payload.data.url || "/",
  };
  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const url = event.notification.data.url;
  event.waitUntil(clients.openWindow(url));
});
