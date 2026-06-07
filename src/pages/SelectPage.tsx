import React from 'react';
import { useNavigate } from 'react-router-dom';
import SymptomSelector from '@/components/SymptomSelector';
import { useSession } from '@/context/SessionContext';

const SelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedSymptoms, setSelectedSymptoms, analyze } = useSession();

  const handleAnalyze = () => {
    analyze();
    navigate('/analyzing');
  };

  return (
    <SymptomSelector
      selectedSymptoms={selectedSymptoms}
      onSymptomsChange={setSelectedSymptoms}
      onAnalyze={handleAnalyze}
    />
  );
};

export default SelectPage;
