
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, Heart, Clock, Award } from 'lucide-react';

interface HistoryRecord {
  date: string;
  symptoms: string[];
  pointsUsed: string[];
  duration: number;
  completed: boolean;
}

interface HistoryViewProps {
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onBack }) => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    // 로컬 스토리지에서 히스토리 불러오기
    const savedHistory = localStorage.getItem('sonkil-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const hasRecordForDate = (date: string) => {
    return history.some(record => record.date === date && record.completed);
  };

  const getRecordForDate = (date: string) => {
    return history.find(record => record.date === date && record.completed);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // 빈 칸 추가
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const hasRecord = hasRecordForDate(dateStr);
      const isToday = new Date().toDateString() === new Date(dateStr).toDateString();

      days.push(
        <div key={day} className="h-12 flex items-center justify-center relative">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              isToday
                ? 'bg-sonkil-primary text-white'
                : hasRecord
                ? 'bg-sonkil-primary/20 text-sonkil-primary-dark'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {day}
            {hasRecord && (
              <Heart className="absolute -top-1 -right-1 h-4 w-4 fill-sonkil-accent text-sonkil-accent" />
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const recentRecords = history
    .filter(record => record.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const totalSessions = history.filter(record => record.completed).length;
  const consecutiveDays = getConsecutiveDays();

  function getConsecutiveDays() {
    const sortedDates = history
      .filter(record => record.completed)
      .map(record => record.date)
      .sort()
      .reverse();

    if (sortedDates.length === 0) return 0;

    let consecutive = 1;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // 오늘 또는 어제 기록이 있는지 확인
    if (!sortedDates.includes(todayStr) && !sortedDates.includes(yesterdayStr)) {
      return 0;
    }

    for (let i = 1; i < sortedDates.length; i++) {
      const current = new Date(sortedDates[i]);
      const previous = new Date(sortedDates[i - 1]);
      const diffTime = previous.getTime() - current.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        consecutive++;
      } else {
        break;
      }
    }

    return consecutive;
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-sonkil-primary hover:bg-sonkil-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          돌아가기
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">나의 손길</h2>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-sonkil-primary/10 to-sonkil-primary/5">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-sonkil-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-sonkil-primary-dark">{totalSessions}</div>
            <div className="text-sm text-gray-600">총 실천 횟수</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-sonkil-accent/10 to-sonkil-accent/5">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-sonkil-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-sonkil-accent">{consecutiveDays}</div>
            <div className="text-sm text-gray-600">연속 실천일</div>
          </CardContent>
        </Card>
      </div>

      {/* 캘린더 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-sonkil-primary" />
            {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </CardContent>
      </Card>

      {/* 최근 기록 */}
      {recentRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-sonkil-primary" />
              최근 손길 기록
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentRecords.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-sonkil-primary/5 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">
                    {new Date(record.date).toLocaleDateString('ko-KR', {
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {record.symptoms.join(', ')} • {record.pointsUsed.length}개 지압점
                  </div>
                </div>
                <Heart className="h-5 w-5 fill-sonkil-accent text-sonkil-accent" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HistoryView;
