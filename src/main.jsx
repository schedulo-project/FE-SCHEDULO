import { createRoot } from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import App from "./App.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
      cacheTime: 10 * 60 * 1000, // 10분간 메모리 보관
      retry: 1, // 실패시 1번 재시도
      refetchOnWindowFocus: false, // 창 포커스시 자동 새로고침 비활성화
      refetchOnMount: true, // 컴포넌트 마운트시 새로고침
    },
    mutations: {
      retry: 1, // mutation 실패시 1번 재시도
    },
  },
});

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
