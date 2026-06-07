import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import PressureGuide from '@/components/PressureGuide';
import { useSession } from '@/context/SessionContext';
import { acupressurePoints } from '@/data/acupressureData';

const GuidePage: React.FC = () => {
  const navigate = useNavigate();
  const { pointId } = useParams<{ pointId: string }>();
  const { recommendedPoints, markCompleted } = useSession();

  // 추천 결과 없이 직접 들어온 경우 처음으로
  if (recommendedPoints.length === 0) return <Navigate to="/" replace />;

  const point = acupressurePoints.find((p) => p.id === pointId);
  if (!point) return <Navigate to="/result" replace />;

  const handleComplete = () => {
    markCompleted(point.id);
  };

  const handleNext = () => {
    const currentIndex = recommendedPoints.findIndex((id) => id === point.id);
    const nextId = recommendedPoints[currentIndex + 1];
    if (nextId) {
      navigate(`/guide/${nextId}`);
    } else {
      navigate('/complete');
    }
  };

  return <PressureGuide point={point} onComplete={handleComplete} onNext={handleNext} />;
};

export default GuidePage;
