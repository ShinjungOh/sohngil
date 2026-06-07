import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { acupressurePoints, AcupressurePoint } from '@/data/acupressureData';
import handPalmImg from '@/assets/hands/hand-palm.png';
import handBackImg from '@/assets/hands/hand-back.png';

interface HandPressureMapProps {
  recommendedPoints?: string[];
  onPointSelect?: (point: AcupressurePoint) => void;
}

const HAND_IMAGE: Record<'palm' | 'back', string> = {
  palm: handPalmImg,
  back: handBackImg,
};

const HandPressureMap: React.FC<HandPressureMapProps> = ({
  recommendedPoints = acupressurePoints.map((p) => p.id),
  onPointSelect = () => {},
}) => {
  const [selectedSide, setSelectedSide] = useState<'palm' | 'back'>('palm');
  const [selectedPoint, setSelectedPoint] = useState<AcupressurePoint | null>(null);

  // 단일 소스(acupressureData)에서 추천된 점만, 현재 보고 있는 면(손바닥/손등)으로 필터
  const filteredPoints = acupressurePoints.filter(
    (point) => point.side === selectedSide && recommendedPoints.includes(point.id)
  );

  // 추천된 점이 손바닥/손등 중 어느 면에 있는지 (탭 안내용)
  const recommendedSides = new Set(
    acupressurePoints
      .filter((p) => recommendedPoints.includes(p.id))
      .map((p) => p.side)
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
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              손바닥
              {recommendedSides.has('palm') && selectedSide !== 'palm' && (
                <span className="ml-1 inline-block w-2 h-2 rounded-full bg-orange-500" />
              )}
            </Button>
            <Button
              variant={selectedSide === 'back' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedSide('back')}
              className={`rounded-full px-6 ${
                selectedSide === 'back'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              손등
              {recommendedSides.has('back') && selectedSide !== 'back' && (
                <span className="ml-1 inline-block w-2 h-2 rounded-full bg-orange-500" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 손 이미지와 지압점 */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/*
            relative 컨테이너 = 지압점 퍼센트 좌표의 기준 박스.
            손 이미지(1024x1536, 2:3)에 맞춰 aspect-[2/3]로 맞춤.
            지압점 좌표는 acupressureData.position(퍼센트) 기준으로 이 박스 위에 오버레이.
          */}
          <div className="relative bg-gradient-to-b from-orange-50 to-orange-100 aspect-[2/3]">
            {/* 손 이미지 (배경) */}
            <img
              src={HAND_IMAGE[selectedSide]}
              alt={selectedSide === 'palm' ? '손바닥' : '손등'}
              className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
              draggable={false}
            />

            {/* 지압점 오버레이 (퍼센트 좌표) + 라벨 */}
            {/*
              점+라벨을 하나의 flex 단위로 묶음:
              - items-center → 점과 라벨 높이 항상 동일
              - gap 고정 → 점↔라벨 간격 항상 동일
              - transform 보정으로 '점 중심'이 정확히 지압 위치(left/top %)에 오도록 함
            */}
            {filteredPoints.map((point, index) => {
              const isSelected = selectedPoint?.id === point.id;
              // 라벨은 항상 손 바깥쪽(가장자리)을 향하게 → 가까운 점끼리 라벨이 겹치지 않음
              const labelOnRight = point.position.x >= 50;
              const DOT_SIZE = 26;
              const half = DOT_SIZE / 2;
              return (
                <div
                  key={point.id}
                  className="absolute flex items-center"
                  style={{
                    left: `${point.position.x}%`,
                    top: `${point.position.y}%`,
                    gap: 8,
                    flexDirection: labelOnRight ? 'row' : 'row-reverse',
                    // 점 중심을 정확히 좌표에 맞추기 위한 보정 (라벨 길이와 무관)
                    transform: labelOnRight
                      ? `translate(-${half}px, -50%)`
                      : `translate(calc(-100% + ${half}px), -50%)`,
                  }}
                >
                  {/* 지압점 (점 + 숫자) */}
                  <button
                    type="button"
                    onClick={() => handlePointClick(point)}
                    aria-label={`${index + 1}. ${point.koName}`}
                    className="flex shrink-0 items-center justify-center rounded-full font-bold text-white text-xs shadow-md transition-colors duration-300 animate-pulse-gentle"
                    style={{
                      width: DOT_SIZE,
                      height: DOT_SIZE,
                      backgroundColor: isSelected ? '#ef4444' : '#f97316',
                      border: '3px solid white',
                    }}
                  >
                    {index + 1}
                  </button>
                  {/* 부위/효능 라벨 */}
                  <span
                    className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold shadow-sm pointer-events-none border transition-colors ${
                      isSelected
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white/90 text-gray-800 border-orange-200'
                    }`}
                  >
                    {point.label}
                  </span>
                </div>
              );
            })}

            {/* 추천 점이 이 면에 없을 때 안내 */}
            {filteredPoints.length === 0 && (
              <div className="absolute inset-x-0 bottom-3 text-center text-sm text-orange-700/80 px-4">
                이 면에는 추천 지압점이 없어요. {selectedSide === 'palm' ? '손등' : '손바닥'} 탭을 확인해보세요.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 지압점 정보 */}
      {filteredPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">지압 순서</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredPoints.map((point, index) => (
              <div
                key={point.id}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedPoint?.id === point.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
                onClick={() => handlePointClick(point)}
              >
                <div className="flex items-center gap-3">
                  <Badge className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-500 text-white">
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-800">{point.koName}</h4>
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-700">
                        {point.label}
                      </span>
                    </div>
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
