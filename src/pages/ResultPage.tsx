import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import HandPressureMap from '@/components/HandPressureMap';
import { useSession } from '@/context/SessionContext';
import { AcupressurePoint } from '@/data/acupressureData';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { recommendedPoints } = useSession();

  // 추천 결과 없이 직접 들어온 경우 처음으로
  if (recommendedPoints.length === 0) return <Navigate to="/" replace />;

  const handlePointSelect = (point: AcupressurePoint) => {
    navigate(`/guide/${point.id}`);
  };

  return (
    <HandPressureMap recommendedPoints={recommendedPoints} onPointSelect={handlePointSelect} />
  );
};

export default ResultPage;
