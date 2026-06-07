import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useProfile, Profile } from '@/context/ProfileContext';
import { categories } from '@/data/acupressureData';

const AGE_RANGES = ['10대', '20대', '30대', '40대', '50대 이상'];
const JOBS = ['사무직', '개발자', '학생·수험생', '프리랜서', '디자이너', '교사·강사', '서비스직', '기타'];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { profile, saveProfile } = useProfile();

  // 기존 프로필이 있으면(정보 수정) 그 값으로 미리 채움
  const [ageRange, setAgeRange] = useState(profile?.ageRange ?? '');
  const [job, setJob] = useState(profile?.job ?? '');
  const [tendencies, setTendencies] = useState<string[]>(profile?.tendencies ?? []);

  const toggleTendency = (category: string) => {
    setTendencies((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const canSubmit = ageRange !== '' && job !== '' && tendencies.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const profile: Profile = {
      ageRange,
      job,
      tendencies,
      createdAt: new Date().toISOString(),
    };
    saveProfile(profile);
    navigate('/', { replace: true });
  };

  const Chip: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
    active,
    onClick,
    children,
  }) => (
    <Button
      type="button"
      variant={active ? 'default' : 'outline'}
      onClick={onClick}
      className={`rounded-full ${
        active
          ? 'bg-sohngil-primary text-white hover:bg-sohngil-primary-dark'
          : 'border-sohngil-primary/30 text-gray-700 hover:bg-sohngil-primary/5'
      }`}
    >
      {children}
    </Button>
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* 환영 */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-sohngil-primary/10 flex items-center justify-center">
            <Heart className="h-7 w-7 text-sohngil-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">손길에 오신 걸 환영해요</h2>
        <p className="text-gray-600">
          더 잘 맞는 손길을 위해 간단한 정보를 알려주세요.
          <br />
          입력하신 정보는 이 기기에만 저장됩니다.
        </p>
      </div>

      {/* 나이 */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <p className="font-semibold text-gray-800">나이대</p>
          <div className="flex flex-wrap gap-2">
            {AGE_RANGES.map((age) => (
              <Chip key={age} active={ageRange === age} onClick={() => setAgeRange(age)}>
                {age}
              </Chip>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 직업 */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <p className="font-semibold text-gray-800">직업</p>
          <div className="flex flex-wrap gap-2">
            {JOBS.map((j) => (
              <Chip key={j} active={job === j} onClick={() => setJob(j)}>
                {j}
              </Chip>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 증상 성향 */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <p className="font-semibold text-gray-800">
            주로 불편한 곳 <span className="text-sm font-normal text-gray-500">(여러 개 선택)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Chip
                key={category}
                active={tendencies.includes(category)}
                onClick={() => toggleTendency(category)}
              >
                {category}
              </Chip>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-sohngil-primary to-sohngil-secondary hover:from-sohngil-primary-dark hover:to-sohngil-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-300"
      >
        {canSubmit ? '시작하기' : '항목을 모두 선택해주세요'}
      </Button>
    </div>
  );
};

export default Onboarding;
