import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, Heart, Calendar, User, Settings } from 'lucide-react';
import { useSession } from '@/context/SessionContext';

const NAV = [
  { to: '/history', label: '기록', Icon: Calendar },
  { to: '/profile', label: '내 정보', Icon: User },
  { to: '/settings', label: '설정', Icon: Settings },
];

const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reset } = useSession();

  const path = location.pathname;
  const isOnboarding = path === '/onboarding';
  // 지압 진행 중인 화면(뒤로 가기가 의미 있는 곳)
  const isSessionFlow =
    ['/analyzing', '/result', '/complete'].includes(path) || path.startsWith('/guide');

  // 로고 = 처음으로 (세션 초기화 후 홈)
  const goHome = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sohngil-background via-white to-sohngil-secondary/5">
      {/* 헤더 */}
      <div className="w-full bg-gradient-to-r from-sohngil-primary to-sohngil-secondary text-white py-6 px-4 mb-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isSessionFlow && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    aria-label="이전"
                    className="text-white hover:bg-white/20"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>이전</TooltipContent>
              </Tooltip>
            )}

            <button type="button" onClick={goHome} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold">손길</h1>
                <p className="text-sm opacity-90">당신의 건강을 위한 작은 손길</p>
              </div>
            </button>
          </div>

          {/* 항상 표시되는 네비게이션 (온보딩 제외) */}
          {!isOnboarding && (
            <div className="flex items-center gap-1">
              {NAV.map(({ to, label, Icon }) => {
                const active = path === to;
                return (
                  <Tooltip key={to}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(to)}
                        aria-label={label}
                        className={`text-white hover:bg-white/20 ${active ? 'bg-white/25' : ''}`}
                      >
                        <Icon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 본문 */}
      <div className="container mx-auto px-4 pb-8">
        <div className="animate-fade-in-up">
          <Outlet />
        </div>
      </div>

      {/* 푸터 */}
      <div className="w-full bg-gray-50 py-6 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <p className="text-sm text-gray-600">⚠️ 본 앱은 의학적 치료를 대체하지 않습니다.</p>
          <p className="text-xs text-gray-500">심각한 증상이 지속되면 전문의와 상담하시기 바랍니다.</p>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
