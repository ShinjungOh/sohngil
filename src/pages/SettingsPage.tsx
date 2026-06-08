import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, Volume2, BellRing, Monitor, ShieldCheck } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { isTauri, invokeResult, invokeSafe } from '@/lib/tauri';
import { playChime } from '@/lib/sound';

const INTERVALS = [30, 60, 90, 120];

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({
  checked,
  onChange,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative w-12 h-7 shrink-0 rounded-full transition-colors ${
      checked ? 'bg-sohngil-primary' : 'bg-gray-300'
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-5' : ''
      }`}
    />
  </button>
);

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, update } = useSettings();
  const [permMsg, setPermMsg] = useState<'granted' | 'denied' | null>(null);

  // macOS 알림 권한 요청 (조용히). 리마인더 켤 때 자동 호출.
  const ensurePermission = () => invokeResult<boolean>('request_notification_permission');

  // 알림 테스트: 권한 요청 후 실제 알림 발송
  const testNotification = async () => {
    const granted = await ensurePermission();
    if (granted) {
      await invokeSafe('notify', { title: '손길 ✋', body: '알림이 정상적으로 동작해요!' });
      setPermMsg('granted');
    } else {
      setPermMsg('denied');
    }
  };

  const onReminderToggle = (v: boolean) => {
    update({ reminderEnabled: v });
    if (v) ensurePermission(); // 켤 때 권한 확보 (웹에서는 no-op)
  };

  const Row: React.FC<{
    icon: React.ReactNode;
    title: string;
    desc?: string;
    children: React.ReactNode;
  }> = ({ icon, title, desc, children }) => (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-sohngil-primary">{icon}</div>
        <div>
          <p className="font-medium text-gray-800">{title}</p>
          {desc && <p className="text-sm text-gray-500">{desc}</p>}
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="text-sohngil-primary hover:bg-sohngil-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          돌아가기
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">설정</h2>
      </div>

      {!isTauri && (
        <div className="flex items-center gap-2 rounded-lg bg-sohngil-secondary/10 p-3 text-sm text-sohngil-secondary-dark">
          <Monitor className="h-4 w-4 shrink-0" />
          리마인더·알림은 <b>데스크탑 앱</b>에서만 동작해요. (소리 미리듣기는 가능)
        </div>
      )}

      {/* 알림 권한 (데스크탑) */}
      {isTauri && (
        <Card>
          <CardContent className="p-5 space-y-3">
            <Row
              icon={<ShieldCheck className="h-5 w-5" />}
              title="알림 권한"
              desc="리마인더·완료 알림을 받으려면 macOS 알림 허용이 필요해요"
            >
              <Button
                type="button"
                size="sm"
                onClick={testNotification}
                className="bg-sohngil-primary text-white hover:bg-sohngil-primary-dark"
              >
                알림 테스트
              </Button>
            </Row>
            {permMsg === 'granted' && (
              <p className="text-sm text-emerald-600">
                알림이 허용됐어요. 방금 테스트 알림을 보냈습니다.
              </p>
            )}
            {permMsg === 'denied' && (
              <p className="text-sm text-red-500">
                알림이 꺼져 있어요. <b>시스템 설정 &gt; 알림 &gt; 손길</b>에서 허용해주세요.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* 리마인더 */}
      <Card>
        <CardContent className="p-5 divide-y divide-gray-100">
          <Row
            icon={<Bell className="h-5 w-5" />}
            title="지압 리마인더"
            desc="오래 앉아있으면 지압 알림을 보내드려요"
          >
            <Toggle checked={settings.reminderEnabled} onChange={onReminderToggle} />
          </Row>

          {settings.reminderEnabled && (
            <div className="pt-3">
              <p className="mb-2 text-sm font-medium text-gray-700">알림 간격</p>
              <div className="flex flex-wrap gap-2">
                {INTERVALS.map((m) => (
                  <Button
                    key={m}
                    type="button"
                    variant={settings.reminderInterval === m ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => update({ reminderInterval: m })}
                    className={`rounded-full ${
                      settings.reminderInterval === m
                        ? 'bg-sohngil-primary text-white hover:bg-sohngil-primary-dark'
                        : 'border-sohngil-primary/30 text-gray-700 hover:bg-sohngil-primary/5'
                    }`}
                  >
                    {m}분마다
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 타이머 완료 */}
      <Card>
        <CardContent className="p-5 divide-y divide-gray-100">
          <Row
            icon={<Volume2 className="h-5 w-5" />}
            title="완료 알림음"
            desc="지압 타이머가 끝나면 소리로 알려드려요"
          >
            <div className="flex items-center gap-2">
              {settings.soundEnabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => playChime()}
                  className="text-sohngil-primary hover:bg-sohngil-primary/10"
                >
                  미리듣기
                </Button>
              )}
              <Toggle
                checked={settings.soundEnabled}
                onChange={(v) => update({ soundEnabled: v })}
              />
            </div>
          </Row>

          <Row
            icon={<BellRing className="h-5 w-5" />}
            title="완료 시 시스템 알림"
            desc="창을 안 보고 있어도 완료를 알려드려요"
          >
            <Toggle
              checked={settings.notifyOnComplete}
              onChange={(v) => update({ notifyOnComplete: v })}
            />
          </Row>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-gray-400">설정은 이 기기에만 저장됩니다.</p>
    </div>
  );
};

export default SettingsPage;
