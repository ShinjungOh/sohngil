import React from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryView from '@/components/HistoryView';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  return <HistoryView onBack={() => navigate('/')} />;
};

export default HistoryPage;
