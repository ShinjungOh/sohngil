import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, User } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  // 프로필이 없으면 온보딩으로
  if (!profile) return <Navigate to="/onboarding" replace />;

  const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <div className="flex flex-wrap justify-end gap-2">{children}</div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="text-sonkil-primary hover:bg-sonkil-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          돌아가기
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">내 정보</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-sonkil-primary" />
            개인 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Row label="나이대">
            <span className="font-semibold text-gray-800">{profile.ageRange}</span>
          </Row>
          <Row label="직업">
            <span className="font-semibold text-gray-800">{profile.job}</span>
          </Row>
          <Row label="주로 불편한 곳">
            {profile.tendencies.map((t) => (
              <Badge key={t} className="bg-sonkil-primary/10 text-sonkil-primary-dark">
                {t}
              </Badge>
            ))}
          </Row>
        </CardContent>
      </Card>

      <Button
        onClick={() => navigate('/onboarding')}
        variant="outline"
        className="w-full border-sonkil-primary text-sonkil-primary hover:bg-sonkil-primary hover:text-white"
      >
        <Pencil className="h-4 w-4 mr-2" />
        정보 수정하기
      </Button>

      <p className="text-center text-xs text-gray-400">
        입력하신 정보는 이 기기에만 저장됩니다.
      </p>
    </div>
  );
};

export default ProfilePage;
