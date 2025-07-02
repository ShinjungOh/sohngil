
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { acupressurePoints, AcupressurePoint } from '@/data/acupressureData';

interface HandPressureMapProps {
  recommendedPoints: string[];
  onPointSelect: (point: AcupressurePoint) => void;
}

const HandPressureMap: React.FC<HandPressureMapProps> = ({
  recommendedPoints,
  onPointSelect
}) => {
  const [selectedSide, setSelectedSide] = useState<'palm' | 'back'>('palm');
  const [selectedPoint, setSelectedPoint] = useState<AcupressurePoint | null>(null);

  const filteredPoints = acupressurePoints.filter(
    point => point.side === selectedSide && recommendedPoints.includes(point.id)
  );

  const handlePointClick = (point: AcupressurePoint) => {
    setSelectedPoint(point);
    onPointSelect(point);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* 제목과 토글 */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">권장 지압점</h2>
        <div className="flex justify-center">
          <div className="bg-gray-100 rounded-full p-1">
            <Button
              variant={selectedSide === 'palm' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedSide('palm')}
              className={`rounded-full px-6 ${
                selectedSide === 'palm' 
                  ? 'bg-sonkil-primary text-white' 
                  : 'text-gray-600 hover:text-sonkil-primary'
              }`}
            >
              손바닥
            </Button>
            <Button
              variant={selectedSide === 'back' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedSide('back')}
              className={`rounded-full px-6 ${
                selectedSide === 'back' 
                  ? 'bg-sonkil-primary text-white' 
                  : 'text-gray-600 hover:text-sonkil-primary'
              }`}
            >
              손등
            </Button>
          </div>
        </div>
      </div>

      {/* 손 이미지와 지압점 */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-b from-sonkil-primary/5 to-sonkil-secondary/5 aspect-[4/5]">
            {/* 손 실루엣 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`relative w-64 h-80 ${
                selectedSide === 'palm' 
                  ? 'bg-gradient-to-b from-amber-50 to-amber-100' 
                  : 'bg-gradient-to-b from-amber-100 to-amber-200'
              } rounded-t-full rounded-b-3xl shadow-lg border-2 border-amber-200/50`}>
                
                {/* 지압점 표시 */}
                {filteredPoints.map((point, index) => (
                  <button
                    key={point.id}
                    onClick={() => handlePointClick(point)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                    style={{
                      left: `${point.position.x}%`,
                      top: `${point.position.y}%`
                    }}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-300 group-hover:scale-125 animate-pulse-gentle ${
                      selectedPoint?.id === point.id
                        ? 'bg-sonkil-accent shadow-sonkil-accent/30'
                        : index === 0
                        ? 'bg-sonkil-accent/80 shadow-sonkil-accent/20'
                        : 'bg-sonkil-primary shadow-sonkil-primary/20'
                    }`}>
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded shadow-md whitespace-nowrap">
                        {point.koName}
                      </span>
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                    </div>
                  </button>
                ))}

                {/* 손가락 영역 (장식용) */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-16 bg-amber-100 rounded-t-full opacity-80"></div>
                <div className="absolute -top-1 left-1/3 transform -translate-x-1/2 w-6 h-20 bg-amber-100 rounded-t-full opacity-80"></div>
                <div className="absolute -top-1 left-2/3 transform -translate-x-1/2 w-6 h-18 bg-amber-100 rounded-t-full opacity-80"></div>
                <div className="absolute top-2 left-1/6 transform -translate-x-1/2 w-5 h-14 bg-amber-100 rounded-t-full opacity-80"></div>
                <div className="absolute top-2 right-1/6 transform translate-x-1/2 w-4 h-12 bg-amber-100 rounded-t-full opacity-80"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 지압점 정보 */}
      {filteredPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-sonkil-primary-dark">지압 순서</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredPoints.map((point, index) => (
              <div
                key={point.id}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedPoint?.id === point.id
                    ? 'border-sonkil-primary bg-sonkil-primary/5'
                    : 'border-gray-200 hover:border-sonkil-primary/50 hover:bg-gray-50'
                }`}
                onClick={() => handlePointClick(point)}
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{point.koName}</h4>
                    <p className="text-sm text-gray-600">{point.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HandPressureMap;
