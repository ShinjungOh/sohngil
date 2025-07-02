
import React, { useState } from 'react';
import SymptomSelector from '@/components/SymptomSelector';
import LoadingAnalysis from '@/components/LoadingAnalysis';
import HandPressureMap from '@/components/HandPressureMap';
import PressureGuide from '@/components/PressureGuide';
import { Button } from '@/components/ui/button';
import { acupressurePoints, symptoms, AcupressurePoint } from '@/data/acupressureData';
import { ArrowLeft, Home } from 'lucide-react';

type AppState = 'selection' | 'loading' | 'results' | 'guide';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('selection');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [recommendedPoints, setRecommendedPoints] = useState<string[]>([]);
  const [currentPoint, setCurrentPoint] = useState<AcupressurePoint | null>(null);

  const handleAnalyze = () => {
    setCurrentState('loading');
  };

  const handleAnalysisComplete = () => {
    // 선택된 증상들에 기반해 지압점 추천
    const pointIds = new Set<string>();
    selectedSymptoms.forEach(symptomId => {
      const symptom = symptoms.find(s => s.id === symptomId);
      if (symptom) {
        symptom.relatedPoints.forEach(pointId => pointIds.add(pointId));
      }
    });
    
    setRecommendedPoints(Array.from(pointIds));
    setCurrentState('results');
  };

  const handlePointSelect = (point: AcupressurePoint) => {
    setCurrentPoint(point);
    setCurrentState('guide');
  };

  const handlePressureComplete = () => {
    console.log(`${currentPoint?.koName} 지압 완료`);
  };

  const handleNext = () => {
    // 다음 지압점으로 이동하거나 결과 화면으로 돌아가기
    const currentIndex = recommendedPoints.findIndex(id => id === currentPoint?.id);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < recommendedPoints.length) {
      const nextPointId = recommendedPoints[nextIndex];
      const nextPoint = acupressurePoints.find(p => p.id === nextPointId);
      if (nextPoint) {
        setCurrentPoint(nextPoint);
      }
    } else {
      setCurrentState('results');
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setRecommendedPoints([]);
    setCurrentPoint(null);
    setCurrentState('selection');
  };

  const renderHeader = () => (
    <div className="w-full bg-gradient-to-r from-healing-mint to-healing-sky text-white py-6 px-4 mb-8">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {currentState !== 'selection' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentState(currentState === 'guide' ? 'results' : 'selection')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              이전
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">PalmHealing</h1>
            <p className="text-sm opacity-90">손바닥 지압 가이드</p>
          </div>
        </div>
        
        {currentState !== 'selection' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-white hover:bg-white/20"
          >
            <Home className="h-4 w-4 mr-2" />
            처음으로
          </Button>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentState) {
      case 'selection':
        return (
          <SymptomSelector
            selectedSymptoms={selectedSymptoms}
            onSymptomsChange={setSelectedSymptoms}
            onAnalyze={handleAnalyze}
          />
        );
        
      case 'loading':
        return <LoadingAnalysis onComplete={handleAnalysisComplete} />;
        
      case 'results':
        return (
          <HandPressureMap
            recommendedPoints={recommendedPoints}
            onPointSelect={handlePointSelect}
          />
        );
        
      case 'guide':
        return currentPoint ? (
          <PressureGuide
            point={currentPoint}
            onComplete={handlePressureComplete}
            onNext={handleNext}
          />
        ) : null;
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-healing-mint/5 via-white to-healing-sky/5">
      {renderHeader()}
      
      <div className="container mx-auto px-4 pb-8">
        <div className="animate-fade-in-up">
          {renderContent()}
        </div>
      </div>

      {/* 푸터 */}
      <div className="w-full bg-gray-50 py-6 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <p className="text-sm text-gray-600">
            ⚠️ 본 앱은 의학적 치료를 대체하지 않습니다. 
          </p>
          <p className="text-xs text-gray-500">
            심각한 증상이 지속되면 전문의와 상담하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
