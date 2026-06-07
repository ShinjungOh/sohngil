import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Heart, Calendar, User } from 'lucide-react';
import { useSession } from '@/context/SessionContext';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reset } = useSession();

  const path = location.pathname;
  const isHome = path === '/';
  const isOnboarding = path === '/onboarding';
  // 지압 진행/기록/프로필 등 홈이 아닌 화면
  const inFlow = !isHome && !isOnboarding;

  const goHome = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sohngil-background via-white to-sohngil-secondary/5">
      {/* 헤더 */}
      <div className="w-full bg-gradient-to-r from-sohngil-primary to-sohngil-secondary text-white py-6 px-4 mb-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {inFlow && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                이전
              </Button>
            )}

            <button
              type="button"
              onClick={() => !isOnboarding && navigate('/')}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold">손길</h1>
                <p className="text-sm opacity-90">당신의 건강을 위한 작은 손길</p>
              </div>
            </button>
          </div>

          {!isOnboarding && (
            <div className="flex items-center gap-2">
              {isHome && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/history')}
                    className="text-white hover:bg-white/20"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    기록
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/profile')}
                    className="text-white hover:bg-white/20"
                  >
                    <User className="h-4 w-4 mr-2" />
                    내 정보
                  </Button>
                </>
              )}
              {inFlow && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goHome}
                  className="text-white hover:bg-white/20"
                >
                  <Home className="h-4 w-4 mr-2" />
                  처음으로
                </Button>
              )}
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
