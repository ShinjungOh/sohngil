
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingAnalysisProps {
  onComplete: () => void;
}

const LoadingAnalysis: React.FC<LoadingAnalysisProps> = ({ onComplete }) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [progress, setProgress] = useState(0);

  const tips = [
    "지압은 통증이 아닌 시원함을 느낄 정도로 해주세요",
    "천천히 깊게 호흡하며 지압하면 더 효과적입니다",
    "하루 2-3회 규칙적으로 하는 것이 좋습니다",
    "지압 후 충분한 수분 섭취를 권장합니다"
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          onComplete();
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, [onComplete]);

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="overflow-hidden">
        <CardContent className="p-8 text-center space-y-6">
          {/* 로딩 애니메이션 */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6">
              <div className="w-full h-full border-4 border-sohngil-primary/20 rounded-full animate-spin">
                <div className="w-4 h-4 bg-sohngil-primary rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* 진행률 */}
            <div className="text-2xl font-bold text-sohngil-primary-dark mb-2">
              {progress}%
            </div>
          </div>

          {/* 상태 메시지 */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              최적의 지압점을 찾고 있습니다...
            </h3>
            <p className="text-gray-600">
              선택하신 증상을 분석 중입니다
            </p>
          </div>

          {/* 팁 */}
          <div className="bg-sohngil-primary/5 p-4 rounded-lg border border-sohngil-primary/20">
            <div className="text-sm font-medium text-sohngil-primary-dark mb-2">
              💡 지압 팁
            </div>
            <p className="text-sm text-gray-700 animate-fade-in-up">
              {tips[currentTip]}
            </p>
          </div>

          {/* 진행 바 */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-sohngil-primary to-sohngil-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingAnalysis;
