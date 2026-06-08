import React from 'react';
import { AcupressurePoint } from '@/data/acupressureData';
import handPalmImg from '@/assets/hands/hand-palm.png';
import handBackImg from '@/assets/hands/hand-back.png';

const HAND_IMAGE: Record<'palm' | 'back', string> = {
  palm: handPalmImg,
  back: handBackImg,
};

interface HandPointPreviewProps {
  point: AcupressurePoint;
  widthPx?: number;
}

/** 작은 손 이미지 위에 지압점 한 곳을 표시하는 미리보기 (가이드 화면용) */
const HandPointPreview: React.FC<HandPointPreviewProps> = ({ point, widthPx = 120 }) => {
  return (
    <div className="shrink-0" style={{ width: widthPx }}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gradient-to-b from-orange-50 to-orange-100">
        <img
          src={HAND_IMAGE[point.side]}
          alt={point.side === 'palm' ? '손바닥' : '손등'}
          className="absolute inset-0 h-full w-full object-contain select-none pointer-events-none"
          draggable={false}
        />
        {/* 정렬용 wrapper(translate)와 애니메이션(scale)을 분리 — 같이 두면 transform이 충돌해 점이 밀림 */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${point.position.x}%`, top: `${point.position.y}%` }}
        >
          <div
            className="rounded-full bg-orange-500 animate-pulse-gentle"
            style={{
              width: 20,
              height: 20,
              border: '3px solid white',
              boxShadow: '0 0 0 4px rgba(249,115,22,0.3), 0 0 12px 3px rgba(249,115,22,0.6)',
              animationDuration: '2.8s',
            }}
          />
        </div>
      </div>
      <p className="mt-1 text-center text-xs text-gray-500">
        {point.side === 'palm' ? '손바닥' : '손등'} 기준
      </p>
    </div>
  );
};

export default HandPointPreview;
