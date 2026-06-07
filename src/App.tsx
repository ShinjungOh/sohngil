import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { ProfileProvider, useProfile } from "@/context/ProfileContext";
import { SessionProvider } from "@/context/SessionContext";
import AppLayout from "@/components/AppLayout";
import Onboarding from "./pages/Onboarding";
import SelectPage from "./pages/SelectPage";
import AnalyzingPage from "./pages/AnalyzingPage";
import ResultPage from "./pages/ResultPage";
import GuidePage from "./pages/GuidePage";
import CompletePage from "./pages/CompletePage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// 데스크탑(Tauri)은 file:// 방식이라 HashRouter, 웹은 깔끔한 URL을 위해 BrowserRouter
const isTauri = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
const Router = isTauri ? HashRouter : BrowserRouter;

// 프로필(온보딩)이 없으면 온보딩으로 보낸다
const RequireProfile = () => {
  const { profile } = useProfile();
  if (!profile) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <ProfileProvider>
          <SessionProvider>
            <Routes>
              {/* 공통 레이아웃(헤더/푸터) */}
              <Route element={<AppLayout />}>
                {/* 온보딩: 프로필 가드 밖 (첫 실행/정보 수정) */}
                <Route path="/onboarding" element={<Onboarding />} />

                {/* 프로필이 있어야 접근 가능한 화면들 */}
                <Route element={<RequireProfile />}>
                  <Route path="/" element={<SelectPage />} />
                  <Route path="/analyzing" element={<AnalyzingPage />} />
                  <Route path="/result" element={<ResultPage />} />
                  <Route path="/guide/:pointId" element={<GuidePage />} />
                  <Route path="/complete" element={<CompletePage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SessionProvider>
        </ProfileProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
