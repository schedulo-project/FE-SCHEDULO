import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600, // 청크 크기 경고 제한 값을 증가 (단위: KB)
    rollupOptions: {
      output: {
        manualChunks: {
          // 큰 라이브러리를 별도의 청크로 분리
          "react-vendor": ["react", "react-dom"],
          "calendar-vendor": ["react-big-calendar", "moment"],
        },
      },
    },
  },
});
