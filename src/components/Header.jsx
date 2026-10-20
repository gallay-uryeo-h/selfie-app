import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Maximize2, Minimize2, Sparkles, Camera, Palette, Printer, Settings, Sun, Moon } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function Header({ currentStep, onReset, soundMuted, onToggleSound, onOpenSettings, theme = 'dark', onToggleTheme }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const steps = [
    { num: 1, label: '프레임 선택', icon: Palette },
    { num: 2, label: '4컷 촬영', icon: Camera },
    { num: 3, label: '스티커 꾸미기', icon: Sparkles },
    { num: 4, label: '인쇄 & QR', icon: Printer },
  ];

  return (
    <header className="no-print glass-panel" style={{ margin: '16px 20px', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50 }}>
      {/* Brand & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
          fontSize: '20px'
        }}>
          📸
        </div>
        <div>
          <h1 className="header-title-gradient" style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.3px', background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Find Your English Spectrum!
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            2022 개정 영어과 선택과목 & 세특 스티커 포토부스
          </p>
        </div>
      </div>

      {/* Step Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {steps.map((st, i) => {
          const Icon = st.icon;
          const isActive = currentStep === st.num;
          const isPassed = currentStep > st.num;
          return (
            <React.Fragment key={st.num}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.3) 0%, rgba(236, 72, 153, 0.2) 100%)' 
                  : isPassed ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                border: isActive ? '1px solid rgba(129, 140, 248, 0.4)' : '1px solid transparent',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isActive ? '#6366f1' : isPassed ? '#10b981' : 'rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isPassed ? '✓' : st.num}
                </div>
                <span style={{
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#ffffff' : isPassed ? '#94a3b8' : 'rgba(255, 255, 255, 0.4)'
                }}>
                  {st.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: '12px', height: '2px', background: isPassed ? '#10b981' : 'rgba(255, 255, 255, 0.15)' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Utility Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => {
            sound.playPop();
            onOpenSettings && onOpenSettings();
          }}
          title="스티커 디자인 및 키오스크 설정"
          className="btn btn-secondary"
          style={{ padding: '8px 12px', borderRadius: '10px', gap: '6px' }}
        >
          <Settings size={17} color="#ec4899" />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>설정</span>
        </button>

        <button
          onClick={onToggleTheme}
          title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
          className="btn btn-secondary"
          style={{ padding: '8px 12px', borderRadius: '10px' }}
        >
          {theme === 'light' ? <Moon size={18} color="#6366f1" /> : <Sun size={18} color="#f59e0b" />}
        </button>

        <button
          onClick={onToggleSound}
          title={soundMuted ? '소리 켜기' : '소리 끄기'}
          className="btn btn-secondary"
          style={{ padding: '8px 12px', borderRadius: '10px' }}
        >
          {soundMuted ? <VolumeX size={18} color="#ef4444" /> : <Volume2 size={18} color="#10b981" />}
        </button>

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? '전체화면 종료' : '전체화면(키오스크)'}
          className="btn btn-secondary"
          style={{ padding: '8px 12px', borderRadius: '10px' }}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>

        <button
          onClick={() => {
            sound.playPop();
            if (confirm('처음 화면으로 돌아가시겠습니까? 현재 작업 내용이 초기화됩니다.')) {
              onReset();
            }
          }}
          className="btn btn-secondary"
          style={{ padding: '8px 14px', borderRadius: '10px', gap: '6px' }}
        >
          <RotateCcw size={16} />
          <span style={{ fontSize: '13px' }}>처음으로</span>
        </button>
      </div>
    </header>
  );
}
