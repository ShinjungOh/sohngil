
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2, RotateCcw, Calendar, Trophy, Sparkles } from 'lucide-react';

interface CompletionScreenProps {
  completedPoints: string[];
  selectedSymptoms: string[];
  onRestart: () => void;
  onViewHistory: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  completedPoints,
  selectedSymptoms,
  onRestart,
  onViewHistory
}) => {
  const [showAnimation, setShowAnimation] = useState(true);

  const saveToHistory = () => {
    const today = new Date().toISOString().split('T')[0];
    const existingHistory = localStorage.getItem('sohngil-history');
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    
    const newRecord = {
      date: today,
      symptoms: selectedSymptoms,
      pointsUsed: completedPoints,
      duration: completedPoints.length * 60, // 각 지압점당 1분 가정
      completed: true
    };

    // 오늘 날짜의 기록이 이미 있으면 업데이트, 없으면 추가
    const existingIndex = history.findIndex((record: any) => record.date === today);
    if (existingIndex >= 0) {
      history[existingIndex] = newRecord;
    } else {
      history.push(newRecord);
    }
    
    localStorage.setItem('sohngil-history', JSON.stringify(history));
  };

  React.useEffect(() => {
    saveToHistory();
    const timer = setTimeout(() => setShowAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '손길 - 지압 완료!',
        text: `오늘 ${completedPoints.length}개의 지압점으로 건강관리를 완료했어요! 🙌`,
        url: window.location.href,
      });
    } else {
      // 폴백: 클립보드에 복사
      const text = `손길 앱으로 오늘 ${completedPoints.length}개의 지압점 마사지를 완료했어요! 🙌`;
      navigator.clipboard.writeText(text);
      alert('클립보드에 복사되었습니다!');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Card className="overflow-hidden relative">
        {/* 배경 애니메이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-sohngil-primary/10 via-sohngil-secondary/10 to-sohngil-accent/10">
          {showAnimation && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse-gentle">
                <Sparkles className="h-16 w-16 text-sohngil-primary animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>
          )}
        </div>

        <CardContent className="relative p-8 text-center space-y-6">
          {/* 완료 메시지 */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Heart className="h-16 w-16 fill-sohngil-accent text-sohngil-accent animate-pulse-gentle" />
                <div className="absolute -top-2 -right-2">
                  <Trophy className="h-8 w-8 text-yellow-500 animate-bounce" />
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                오늘의 손길 완료!
              </h2>
              <p className="text-sohngil-primary-dark font-medium">
                수고하셨습니다 🙌
              </p>
            </div>
          </div>

          {/* 완료 정보 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">완료한 지압점</span>
              <span className="font-bold text-sohngil-primary-dark">{completedPoints.length}개</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">관리한 증상</span>
              <span className="font-bold text-sohngil-primary-dark">{selectedSymptoms.length}개</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">소요 시간</span>
              <span className="font-bold text-sohngil-primary-dark">약 {completedPoints.length}분</span>
            </div>
          </div>

          {/* 격려 메시지 */}
          <div className="bg-sohngil-primary/5 p-4 rounded-lg border border-sohngil-primary/20">
            <p className="text-sm text-sohngil-primary-dark font-medium">
              💝 작은 손길이 모여 큰 건강이 됩니다
            </p>
            <p className="text-xs text-gray-600 mt-1">
              꾸준한 실천으로 더 건강한 내일을 만들어보세요
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 액션 버튼들 */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleShare}
            variant="outline"
            className="border-sohngil-primary text-sohngil-primary hover:bg-sohngil-primary hover:text-white"
          >
            <Share2 className="h-4 w-4 mr-2" />
            공유하기
          </Button>
          
          <Button
            onClick={onViewHistory}
            variant="outline"
            className="border-sohngil-secondary text-sohngil-secondary hover:bg-sohngil-secondary hover:text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            기록 보기
          </Button>
        </div>
        
        <Button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-sohngil-primary to-sohngil-secondary hover:from-sohngil-primary-dark hover:to-sohngil-secondary-dark text-white"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          새로운 손길 시작하기
        </Button>
      </div>
    </div>
  );
};

export default CompletionScreen;
