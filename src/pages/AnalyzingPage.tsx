import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import LoadingAnalysis from '@/components/LoadingAnalysis';
import { useSession } from '@/context/SessionContext';

const AnalyzingPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedSymptoms } = useSession();

  // 증상 선택 없이 직접 들어온 경우 처음으로
  if (selectedSymptoms.length === 0) return <Navigate to="/" replace />;

  return <LoadingAnalysis onComplete={() => navigate('/result', { replace: true })} />;
};

export default AnalyzingPage;
