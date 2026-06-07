import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import CompletionScreen from '@/components/CompletionScreen';
import { useSession } from '@/context/SessionContext';

const CompletePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedSymptoms, completedPoints, reset } = useSession();

  // 진행한 지압이 없는데 직접 들어온 경우 처음으로
  if (completedPoints.length === 0) return <Navigate to="/" replace />;

  const handleRestart = () => {
    reset();
    navigate('/');
  };

  return (
    <CompletionScreen
      completedPoints={completedPoints}
      selectedSymptoms={selectedSymptoms}
      onRestart={handleRestart}
      onViewHistory={() => navigate('/history')}
    />
  );
};

export default CompletePage;
