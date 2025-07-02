
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AcupressurePoint } from '@/data/acupressureData';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';

interface PressureGuideProps {
  point: AcupressurePoint;
  onComplete: () => void;
  onNext: () => void;
}

const PressureGuide: React.FC<PressureGuideProps> = ({
  point,
  onComplete,
  onNext
}) => {
  const [isActive, setIsActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(point.duration);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setRemainingTime(point.duration);
    setIsActive(false);
    setIsCompleted(false);
  }, [point]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, remainingTime]);

  const handleStart = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setRemainingTime(point.duration);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  const progress = ((point.duration - remainingTime) / point.duration) * 100;

  const getPressureColor = (pressure: string) => {
    switch (pressure) {
      case 'light': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'firm': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPressureText = (pressure: string) => {
    switch (pressure) {
      case 'light': return '가볍게';
      case 'medium': return '적당히';
      case 'firm': return '강하게';
      default: return '적당히';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-healing-mint to-healing-sky text-white">
          <CardTitle className="text-center">
            <div className="text-2xl font-bold">{point.koName}</div>
            <div className="text-sm opacity-90 mt-1">{point.name}</div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* 타이머 */}
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-healing-mint-dark">
              {remainingTime}
            </div>
            <div className="text-sm text-gray-600">초 남음</div>
            
            <Progress 
              value={progress} 
              className="h-3 bg-gray-200"
            />
          </div>

          {/* 지압 정보 */}
          <div className="space-y-4">
            <div className="bg-healing-mint/5 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">위치</h4>
              <p className="text-gray-700">{point.description}</p>
            </div>

            <div className="bg-healing-sky/5 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">방법</h4>
              <p className="text-gray-700">{point.method}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-600">압력:</span>
                <span className={`text-sm font-semibold ${getPressureColor(point.pressure)}`}>
                  {getPressureText(point.pressure)}
                </span>
              </div>
            </div>
          </div>

          {/* 컨트롤 버튼 */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleStart}
              variant={isActive ? "outline" : "default"}
              size="lg"
              className={`flex-1 ${!isActive ? 'bg-healing-mint hover:bg-healing-mint-dark text-white' : ''}`}
            >
              {isActive ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  일시정지
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  시작
                </>
              )}
            </Button>

            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            {(isCompleted || remainingTime === 0) && (
              <Button
                onClick={handleComplete}
                variant="default"
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="mr-2 h-5 w-5" />
                완료
              </Button>
            )}
          </div>

          {/* 다음 단계 버튼 */}
          <Button
            onClick={onNext}
            variant="outline"
            className="w-full border-healing-mint text-healing-mint hover:bg-healing-mint hover:text-white"
          >
            다음 지압점으로
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PressureGuide;
