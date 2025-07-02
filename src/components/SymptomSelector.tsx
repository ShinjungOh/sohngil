
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { symptoms, categories, Symptom } from '@/data/acupressureData';

interface SymptomSelectorProps {
  selectedSymptoms: string[];
  onSymptomsChange: (symptoms: string[]) => void;
  onAnalyze: () => void;
}

const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  selectedSymptoms,
  onSymptomsChange,
  onAnalyze
}) => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const toggleSymptom = (symptomId: string) => {
    if (selectedSymptoms.includes(symptomId)) {
      onSymptomsChange(selectedSymptoms.filter(id => id !== symptomId));
    } else if (selectedSymptoms.length < 5) {
      onSymptomsChange([...selectedSymptoms, symptomId]);
    }
  };

  const filteredSymptoms = symptoms.filter(s => s.category === activeCategory);

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* 제목 */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">어떤 증상이 있으신가요?</h2>
        <p className="text-sonkil-primary-dark">최대 5개까지 선택 가능합니다</p>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full ${
              activeCategory === category 
                ? 'bg-sonkil-primary text-white hover:bg-sonkil-primary-dark' 
                : 'border-sonkil-primary text-sonkil-primary hover:bg-sonkil-primary/10'
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* 선택된 증상 표시 */}
      {selectedSymptoms.length > 0 && (
        <Card className="bg-sonkil-primary/5 border-sonkil-primary/20">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">선택된 증상</p>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map(symptomId => {
                const symptom = symptoms.find(s => s.id === symptomId);
                return symptom ? (
                  <Badge 
                    key={symptomId}
                    variant="secondary"
                    className="bg-sonkil-primary text-white cursor-pointer hover:bg-sonkil-primary-dark"
                    onClick={() => toggleSymptom(symptomId)}
                  >
                    {symptom.icon} {symptom.name} ×
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 증상 선택 버튼들 */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {filteredSymptoms.map(symptom => (
              <Button
                key={symptom.id}
                variant={selectedSymptoms.includes(symptom.id) ? "default" : "outline"}
                className={`p-4 h-auto flex flex-col items-center gap-2 transition-all duration-200 ${
                  selectedSymptoms.includes(symptom.id)
                    ? 'bg-sonkil-primary text-white hover:bg-sonkil-primary-dark shadow-lg scale-105'
                    : 'border-sonkil-primary/30 hover:border-sonkil-primary hover:bg-sonkil-primary/5'
                }`}
                onClick={() => toggleSymptom(symptom.id)}
                disabled={!selectedSymptoms.includes(symptom.id) && selectedSymptoms.length >= 5}
              >
                <span className="text-2xl">{symptom.icon}</span>
                <span className="text-sm font-medium text-center">{symptom.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 분석하기 버튼 */}
      <Button
        onClick={onAnalyze}
        disabled={selectedSymptoms.length === 0}
        className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-sonkil-primary to-sonkil-secondary hover:from-sonkil-primary-dark hover:to-sonkil-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {selectedSymptoms.length === 0 ? '증상을 선택해주세요' : `${selectedSymptoms.length}개 증상 분석하기`}
      </Button>
    </div>
  );
};

export default SymptomSelector;
