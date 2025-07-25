
import React, { useState } from 'react';
import SymptomSelector from '@/components/SymptomSelector';
import LoadingAnalysis from '@/components/LoadingAnalysis';
import HandPressureMap from '@/components/HandPressureMap';
import PressureGuide from '@/components/PressureGuide';
import CompletionScreen from '@/components/CompletionScreen';
import HistoryView from '@/components/HistoryView';
import { Button } from '@/components/ui/button';
import { acupressurePoints, symptoms, AcupressurePoint } from '@/data/acupressureData';
import { ArrowLeft, Home, Heart, Calendar } from 'lucide-react';

type AppState = 'selection' | 'loading' | 'results' | 'guide' | 'completed' | 'history';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('selection');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [recommendedPoints, setRecommendedPoints] = useState<string[]>([]);
  const [currentPoint, setCurrentPoint] = useState<AcupressurePoint | null>(null);
  const [completedPoints, setCompletedPoints] = useState<string[]>([]);

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
    if (currentPoint && !completedPoints.includes(currentPoint.id)) {
      setCompletedPoints(prev => [...prev, currentPoint.id]);
    }
    console.log(`${currentPoint?.koName} 지압 완료`);
  };

  const handleNext = () => {
    // 다음 지압점으로 이동하거나 완료 화면으로 이동
    const currentIndex = recommendedPoints.findIndex(id => id === currentPoint?.id);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < recommendedPoints.length) {
      const nextPointId = recommendedPoints[nextIndex];
      const nextPoint = acupressurePoints.find(p => p.id === nextPointId);
      if (nextPoint) {
        setCurrentPoint(nextPoint);
      }
    } else {
      // 모든 지압점 완료
      setCurrentState('completed');
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setRecommendedPoints([]);
    setCurrentPoint(null);
    setCompletedPoints([]);
    setCurrentState('selection');
  };

  const handleViewHistory = () => {
    setCurrentState('history');
  };

  const renderHeader = () => (
    <div className="w-full bg-gradient-to-r from-sonkil-primary to-sonkil-secondary text-white py-6 px-4 mb-8">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {(currentState !== 'selection' && currentState !== 'history') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (currentState === 'guide') {
                  setCurrentState('results');
                } else if (currentState === 'completed') {
                  setCurrentState('results');
                } else {
                  setCurrentState('selection');
                }
              }}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              이전
            </Button>
          )}
          
          {currentState === 'history' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentState('selection')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              홈으로
            </Button>
          )}
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">손길</h1>
              <p className="text-sm opacity-90">당신의 건강을 위한 작은 손길</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {currentState === 'selection' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewHistory}
              className="text-white hover:bg-white/20"
            >
              <Calendar className="h-4 w-4 mr-2" />
              기록
            </Button>
          )}
          
          {(currentState !== 'selection' && currentState !== 'history') && (
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
        
      case 'completed':
        return (
          <CompletionScreen
            completedPoints={completedPoints}
            selectedSymptoms={selectedSymptoms}
            onRestart={handleReset}
            onViewHistory={handleViewHistory}
          />
        );
        
      case 'history':
        return <HistoryView onBack={() => setCurrentState('selection')} />;
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sonkil-background via-white to-sonkil-secondary/5">
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
