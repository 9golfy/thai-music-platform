'use client';

import { useEffect, useMemo, useState } from 'react';
import { Switch } from '@/components/ui/switch';

type RegistrationControlState = {
  register100Open: boolean;
  registerSupportOpen: boolean;
  updatedAt?: string;
  updatedBy?: string | null;
};

const pageCards = [
  {
    key: 'register100' as const,
    title: 'โรงเรียนดนตรีไทย ๑๐๐%',
    path: '/regist100',
    description: 'ควบคุมการเปิดหรือปิดหน้าลงทะเบียนของโรงเรียนดนตรีไทย ๑๐๐%',
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    key: 'register-support' as const,
    title: 'โรงเรียนสนับสนุนและส่งเสริม',
    path: '/regist-support',
    description: 'ควบคุมการเปิดหรือปิดหน้าลงทะเบียนของโรงเรียนสนับสนุนและส่งเสริม',
    accent: 'from-emerald-500 to-green-600',
  },
];

export default function RegistrationControlPanel() {
  const [state, setState] = useState<RegistrationControlState | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<'register100' | 'register-support' | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    void fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/registration-settings', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'โหลดข้อมูลไม่สำเร็จ');
      }

      setState(data.settings);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const formattedUpdatedAt = useMemo(() => {
    if (!state?.updatedAt) return null;

    return new Date(state.updatedAt).toLocaleString('th-TH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }, [state?.updatedAt]);

  const handleToggle = async (page: 'register100' | 'register-support', isOpen: boolean) => {
    if (!state) return;

    const previous = { ...state };
    const optimistic = {
      ...state,
      register100Open: page === 'register100' ? isOpen : state.register100Open,
      registerSupportOpen: page === 'register-support' ? isOpen : state.registerSupportOpen,
    };

    setState(optimistic);
    setSavingKey(page);
    setError('');

    try {
      const response = await fetch('/api/registration-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, isOpen }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'บันทึกสถานะไม่สำเร็จ');
      }

      setState(data.settings);
    } catch (saveError) {
      setState(previous);
      setError(saveError instanceof Error ? saveError.message : 'บันทึกสถานะไม่สำเร็จ');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-6">
        <h1 className="text-3xl font-bold text-gray-900">ปิดการรับสมัคร</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600">
          เลือกเปิดหรือปิดหน้าลงทะเบียนแต่ละประเภทได้จากหน้านี้ หากปิดไว้ ผู้ใช้ที่เข้า
          `/regist100` หรือ `/regist-support` จะเห็นข้อความแจ้งว่า ปิดรับการลงทะเบียนแล้ว
        </p>
        {formattedUpdatedAt && (
          <p className="mt-3 text-xs text-gray-500">
            อัปเดตล่าสุด {formattedUpdatedAt}
            {state?.updatedBy ? ` โดย ${state.updatedBy}` : ''}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {pageCards.map((card) => {
          const checked = card.key === 'register100' ? state?.register100Open : state?.registerSupportOpen;
          const isSaving = savingKey === card.key;

          return (
            <div
              key={card.key}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className={`bg-gradient-to-r ${card.accent} px-6 py-4 text-white`}>
                <h2 className="text-xl font-semibold">{card.title}</h2>
                <p className="mt-1 text-sm text-white/85">{card.path}</p>
              </div>

              <div className="space-y-5 p-6">
                <p className="text-sm leading-6 text-gray-600">{card.description}</p>

                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">สถานะการเปิดรับสมัคร</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {checked ? 'เปิดรับสมัครอยู่' : 'ปิดรับสมัครอยู่'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        checked
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {checked ? 'On' : 'Off'}
                    </span>
                    <Switch
                      checked={!!checked}
                      disabled={loading || isSaving || !state}
                      onCheckedChange={(next) => handleToggle(card.key, next)}
                      aria-label={`สลับสถานะ ${card.title}`}
                    />
                  </div>
                </div>

                {isSaving && <p className="text-xs text-gray-500">กำลังบันทึกสถานะ...</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
