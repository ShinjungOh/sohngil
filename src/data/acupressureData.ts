
export interface AcupressurePoint {
  id: string;
  name: string;
  koName: string;
  label: string; // 부위/효능 중심 짧은 라벨 (손 지도에 표시)
  position: { x: number; y: number }; // 퍼센트 좌표 (0~100, 손 이미지 영역 기준)
  hand: 'left' | 'right';
  side: 'palm' | 'back';
  symptoms: string[];
  description: string;
  method: string;
  duration: number; // 초
  pressure: 'light' | 'medium' | 'firm';
}

export interface Symptom {
  id: string;
  name: string;
  category: string;
  icon: string;
  relatedPoints: string[];
}

// NOTE: 현재는 "손 부위 지압점"만 엄선해 운영합니다.
// 손이 아닌 부위(발/머리/얼굴 등)의 혈자리는 추후 단계적으로 확장 예정.
export const symptoms: Symptom[] = [
  // 머리/얼굴 영역
  { id: 'headache', name: '두통', category: '머리/얼굴', icon: '🤕', relatedPoints: ['hegu', 'lieque'] },
  { id: 'eye-fatigue', name: '눈의 피로', category: '머리/얼굴', icon: '👁️', relatedPoints: ['hegu', 'laogong'] },
  { id: 'nasal-congestion', name: '코막힘', category: '머리/얼굴', icon: '😤', relatedPoints: ['hegu', 'lieque'] },
  { id: 'jaw-tension', name: '턱관절 불편', category: '머리/얼굴', icon: '😬', relatedPoints: ['hegu'] },

  // 목/어깨 영역
  { id: 'neck-stiffness', name: '목 뻐근함', category: '목/어깨', icon: '🦴', relatedPoints: ['houxi', 'lieque'] },
  { id: 'shoulder-tension', name: '어깨 결림', category: '목/어깨', icon: '💪', relatedPoints: ['houxi', 'hegu'] },

  // 가슴/복부 영역
  { id: 'chest-tightness', name: '가슴 답답함', category: '가슴/복부', icon: '💓', relatedPoints: ['neiguan', 'laogong', 'shaofu'] },
  { id: 'heartburn', name: '속쓰림', category: '가슴/복부', icon: '🔥', relatedPoints: ['neiguan', 'laogong'] },
  { id: 'indigestion', name: '소화불량', category: '가슴/복부', icon: '🤢', relatedPoints: ['neiguan', 'laogong'] },
  { id: 'bloating', name: '복부 팽만감', category: '가슴/복부', icon: '🫃', relatedPoints: ['neiguan', 'hegu'] },

  // 기타 증상
  { id: 'fatigue', name: '전신 피로', category: '기타', icon: '😴', relatedPoints: ['laogong', 'hegu', 'zhongchong'] },
  { id: 'stress', name: '스트레스', category: '기타', icon: '😰', relatedPoints: ['shenmen', 'neiguan', 'laogong'] },
  { id: 'insomnia', name: '불면', category: '기타', icon: '🌙', relatedPoints: ['shenmen', 'laogong'] }
];

export const acupressurePoints: AcupressurePoint[] = [
  // ===== 손등(back) 지압점 =====
  {
    id: 'hegu',
    name: 'Hegu (LI4)',
    koName: '합곡혈',
    label: '두통·어깨',
    position: { x: 33, y: 48 },
    hand: 'right',
    side: 'back',
    symptoms: ['headache', 'eye-fatigue', 'nasal-congestion', 'jaw-tension', 'shoulder-tension', 'bloating', 'fatigue'],
    description: '손등에서 엄지와 검지 뼈가 만나는 움푹한 곳',
    method: '반대편 엄지로 원을 그리듯 지그시 눌러주세요',
    duration: 60,
    pressure: 'medium'
  },
  {
    id: 'houxi',
    name: 'Houxi (SI3)',
    koName: '후계혈',
    label: '목·어깨',
    position: { x: 82, y: 50 },
    hand: 'right',
    side: 'back',
    symptoms: ['neck-stiffness', 'shoulder-tension'],
    description: '주먹을 쥐었을 때 새끼손가락 아래 손날에 생기는 가로금 끝',
    method: '엄지로 손날을 지그시 눌러주세요',
    duration: 45,
    pressure: 'medium'
  },
  {
    id: 'lieque',
    name: 'Lieque (LU7)',
    koName: '열결혈',
    label: '목·두통',
    position: { x: 38, y: 75 },
    hand: 'right',
    side: 'back',
    symptoms: ['headache', 'nasal-congestion', 'neck-stiffness'],
    description: '손목 엄지 쪽, 손목 주름에서 팔꿈치 방향으로 약 2cm 지점',
    method: '검지로 가볍게 문지르듯 눌러주세요',
    duration: 45,
    pressure: 'light'
  },

  // ===== 손바닥(palm) 지압점 =====
  {
    id: 'laogong',
    name: 'Laogong (PC8)',
    koName: '노궁혈',
    label: '피로·스트레스',
    position: { x: 48, y: 52 },
    hand: 'right',
    side: 'palm',
    symptoms: ['eye-fatigue', 'chest-tightness', 'heartburn', 'indigestion', 'fatigue', 'stress', 'insomnia'],
    description: '주먹을 쥐었을 때 중지 끝이 닿는 손바닥 중앙',
    method: '반대편 엄지로 손바닥 중앙을 깊게 눌러주세요',
    duration: 60,
    pressure: 'medium'
  },
  {
    id: 'neiguan',
    name: 'Neiguan (PC6)',
    koName: '내관혈',
    label: '소화불량',
    position: { x: 47, y: 88 },
    hand: 'right',
    side: 'palm',
    symptoms: ['chest-tightness', 'heartburn', 'indigestion', 'bloating', 'stress'],
    description: '손목 안쪽 주름 중앙에서 팔꿈치 방향으로 손가락 세 마디 지점',
    method: '엄지로 깊게 눌러 5초간 유지했다 풀어주세요',
    duration: 45,
    pressure: 'firm'
  },
  {
    id: 'shenmen',
    name: 'Shenmen (HT7)',
    koName: '신문혈',
    label: '불면·스트레스',
    position: { x: 58, y: 80 },
    hand: 'right',
    side: 'palm',
    symptoms: ['stress', 'insomnia'],
    description: '손목 안쪽 주름에서 새끼손가락 쪽 끝의 움푹한 곳',
    method: '가볍게 원을 그리며 마사지해주세요',
    duration: 30,
    pressure: 'light'
  },
  {
    id: 'shaofu',
    name: 'Shaofu (HT8)',
    koName: '소부혈',
    label: '가슴 답답',
    position: { x: 58, y: 48 },
    hand: 'right',
    side: 'palm',
    symptoms: ['chest-tightness'],
    description: '주먹을 쥐었을 때 새끼손가락 끝이 닿는 손바닥 지점',
    method: '엄지로 지그시 눌러주세요',
    duration: 45,
    pressure: 'medium'
  },
  {
    id: 'zhongchong',
    name: 'Zhongchong (PC9)',
    koName: '중충혈',
    label: '졸음·피로',
    position: { x: 52, y: 5 },
    hand: 'right',
    side: 'palm',
    symptoms: ['fatigue'],
    description: '중지 손톱 안쪽 모서리 끝부분',
    method: '반대편 엄지와 검지로 손끝을 꼬집듯 자극해주세요',
    duration: 30,
    pressure: 'medium'
  }
];

export const categories = [
  '머리/얼굴',
  '목/어깨',
  '가슴/복부',
  '기타'
];
