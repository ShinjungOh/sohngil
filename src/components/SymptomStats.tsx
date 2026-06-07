import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Sparkles } from 'lucide-react';
import { symptoms, acupressurePoints } from '@/data/acupressureData';

interface HistoryRecord {
  date: string;
  symptoms: string[];
  pointsUsed: string[];
  duration: number;
  completed: boolean;
}

type Period = 'week' | 'month' | 'all';

const PERIODS: { id: Period; label: string }[] = [
  { id: 'week', label: '이번 주' },
  { id: 'month', label: '이번 달' },
  { id: 'all', label: '전체' },
];

// id → 한글 이름 매핑
const symptomName = (id: string) => symptoms.find((s) => s.id === id)?.name ?? id;
const pointName = (id: string) => acupressurePoints.find((p) => p.id === id)?.koName ?? id;

function inPeriod(dateStr: string, period: Period): boolean {
  if (period === 'all') return true;
  const d = new Date(dateStr);
  const now = new Date();
  if (period === 'month') {
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }
  // week: 최근 7일
  const from = new Date(now);
  from.setDate(now.getDate() - 6);
  from.setHours(0, 0, 0, 0);
  return d >= from;
}

function countBy(records: HistoryRecord[], pick: (r: HistoryRecord) => string[]) {
  const map = new Map<string, number>();
  records.forEach((r) => {
    pick(r).forEach((id) => map.set(id, (map.get(id) ?? 0) + 1));
  });
  return Array.from(map.entries())
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count);
}

const SymptomStats: React.FC<{ history: HistoryRecord[] }> = ({ history }) => {
  const [period, setPeriod] = useState<Period>('month');

  const completed = useMemo(() => history.filter((r) => r.completed), [history]);
  const filtered = useMemo(
    () => completed.filter((r) => inPeriod(r.date, period)),
    [completed, period]
  );

  const symptomStats = useMemo(() => countBy(filtered, (r) => r.symptoms), [filtered]);
  const pointStats = useMemo(() => countBy(filtered, (r) => r.pointsUsed), [filtered]);
  const maxCount = symptomStats[0]?.count ?? 0;
  const topPoint = pointStats[0];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-sonkil-primary" />
          증상별 통계
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 기간 필터 */}
        <div className="flex justify-center">
          <div className="bg-gray-100 rounded-full p-1 flex">
            {PERIODS.map((p) => (
              <Button
                key={p.id}
                variant="ghost"
                size="sm"
                onClick={() => setPeriod(p.id)}
                className={`rounded-full px-4 ${
                  period === p.id
                    ? 'bg-sonkil-primary text-white hover:bg-sonkil-primary-dark'
                    : 'text-gray-600 hover:text-sonkil-primary'
                }`}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">
            아직 이 기간에 기록이 없어요.
            <br />
            지압을 완료하면 통계가 쌓입니다.
          </p>
        ) : (
          <>
            {/* 증상별 횟수 바 */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">자주 관리한 증상</p>
              {symptomStats.map(({ id, count }) => (
                <div key={id} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 truncate text-sm text-gray-700">
                    {symptomName(id)}
                  </span>
                  <div className="flex-1 h-5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sonkil-primary to-sonkil-secondary transition-all"
                      style={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-sm font-semibold text-sonkil-primary-dark">
                    {count}
                  </span>
                </div>
              ))}
            </div>

            {/* 최다 사용 지압점 */}
            {topPoint && (
              <div className="flex items-center gap-3 rounded-lg bg-sonkil-primary/5 p-3">
                <Sparkles className="h-5 w-5 text-sonkil-accent" />
                <div className="text-sm text-gray-700">
                  가장 많이 사용한 지압점{' '}
                  <span className="font-semibold text-sonkil-primary-dark">
                    {pointName(topPoint.id)}
                  </span>{' '}
                  ({topPoint.count}회)
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SymptomStats;
