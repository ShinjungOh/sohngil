
export interface AcupressurePoint {
  id: string;
  name: string;
  koName: string;
  position: { x: number; y: number }; // 퍼센트 좌표
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

export const symptoms: Symptom[] = [
  // 머리/얼굴 영역
  { id: 'headache', name: '두통', category: '머리/얼굴', icon: '🤕', relatedPoints: ['hegu', 'yintang', 'taiyang'] },
  { id: 'eye-fatigue', name: '눈의 피로', category: '머리/얼굴', icon: '👁️', relatedPoints: ['jingming', 'sibai', 'hegu'] },
  { id: 'nasal-congestion', name: '코막힘', category: '머리/얼굴', icon: '😤', relatedPoints: ['yingxiang', 'hegu'] },
  { id: 'jaw-tension', name: '턱관절 불편', category: '머리/얼굴', icon: '😬', relatedPoints: ['jiache', 'xiaguan'] },
  
  // 목/어깨 영역
  { id: 'neck-stiffness', name: '목 뻐근함', category: '목/어깨', icon: '🦴', relatedPoints: ['houxi', 'lieque'] },
  { id: 'shoulder-tension', name: '어깨 결림', category: '목/어깨', icon: '💪', relatedPoints: ['jianzhongshu', 'hegu'] },
  
  // 가슴/복부 영역
  { id: 'chest-tightness', name: '가슴 답답함', category: '가슴/복부', icon: '💓', relatedPoints: ['neiguan', 'shanzhong'] },
  { id: 'heartburn', name: '속쓰림', category: '가슴/복부', icon: '🔥', relatedPoints: ['neiguan', 'zusanli'] },
  { id: 'indigestion', name: '소화불량', category: '가슴/복부', icon: '🤢', relatedPoints: ['neiguan', 'zhongwan', 'zusanli'] },
  { id: 'bloating', name: '복부 팽만감', category: '가슴/복부', icon: '🫃', relatedPoints: ['tianshu', 'qihai'] },
  
  // 기타 증상
  { id: 'fatigue', name: '전신 피로', category: '기타', icon: '😴', relatedPoints: ['baihui', 'yongquan', 'hegu'] },
  { id: 'stress', name: '스트레스', category: '기타', icon: '😰', relatedPoints: ['shenmen', 'yintang', 'neiguan'] },
  { id: 'insomnia', name: '불면', category: '기타', icon: '🌙', relatedPoints: ['shenmen', 'yintang', 'anmian'] }
];

export const acupressurePoints: AcupressurePoint[] = [
  // 손바닥 지압점들
  {
    id: 'hegu',
    name: 'Hegu',
    koName: '합곡혈',
    position: { x: 25, y: 35 },
    hand: 'right',
    side: 'back',
    symptoms: ['headache', 'eye-fatigue', 'nasal-congestion', 'shoulder-tension'],
    description: '엄지와 검지 사이 움푹 들어간 곳',
    method: '엄지로 원을 그리며 부드럽게 눌러주세요',
    duration: 60,
    pressure: 'medium'
  },
  {
    id: 'neiguan',
    name: 'Neiguan',
    koName: '내관혈',
    position: { x: 50, y: 75 },
    hand: 'right',
    side: 'palm',
    symptoms: ['chest-tightness', 'heartburn', 'indigestion', 'stress'],
    description: '손목 주름에서 팔 쪽으로 3cm 지점',
    method: '엄지로 깊게 눌러 5초간 유지 후 완화',
    duration: 45,
    pressure: 'firm'
  },
  {
    id: 'shenmen',
    name: 'Shenmen',
    koName: '신문혈',
    position: { x: 15, y: 80 },
    hand: 'right',
    side: 'palm',
    symptoms: ['stress', 'insomnia', 'fatigue'],
    description: '손목 주름 새끼손가락 쪽 움푹한 곳',
    method: '가볍게 원을 그리며 마사지',
    duration: 30,
    pressure: 'light'
  },
  {
    id: 'houxi',
    name: 'Houxi',
    koName: '후계혈',
    position: { x: 85, y: 45 },
    hand: 'right',
    side: 'back',
    symptoms: ['neck-stiffness', 'shoulder-tension'],
    description: '새끼손가락 바깥쪽 손목 근처',
    method: '엄지로 지그시 눌러주세요',
    duration: 45,
    pressure: 'medium'
  },
  {
    id: 'laogong',
    name: 'Laogong',
    koName: '노궁혈',
    position: { x: 50, y: 50 },
    hand: 'right',
    side: 'palm',
    symptoms: ['fatigue', 'stress', 'chest-tightness'],
    description: '손바닥 정중앙',
    method: '양손을 모아 비비듯 마사지',
    duration: 60,
    pressure: 'medium'
  }
];

export const categories = [
  '머리/얼굴',
  '목/어깨', 
  '가슴/복부',
  '기타'
];
