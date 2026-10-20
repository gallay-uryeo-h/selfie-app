import React from 'react';
import { FRAME_THEMES, FRAME_COLORS, FRAME_LAYOUTS } from '../constants/frames';
import { ArrowRight, Check, Sparkles, LayoutGrid, Columns } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function Step1FrameSelect({
  selectedTheme,
  setSelectedTheme,
  selectedColor,
  setSelectedColor,
  selectedLayout,
  setSelectedLayout,
  onNext,
}) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 24px 40px' }}>
      {/* Intro Banner */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '20px',
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          marginBottom: '12px'
        }}>
          <Sparkles size={16} color="#818cf8" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#c7d2fe' }}>STEP 1 : 나만의 프레임 디자인</span>
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          어떤 스타일의 사진을 남기고 싶나요?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          2022 개정 영어과 프레임 테마와 배경 색상을 골라주세요.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'start' }}>
        {/* Left Column: Theme & Color Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* 1. Theme Selection */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎨</span> 1. 프레임 테마 선택
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              {FRAME_THEMES.map((theme) => {
                const isSelected = selectedTheme.id === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => {
                      sound.playPop();
                      setSelectedTheme(theme);
                    }}
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 700 }}>{theme.name}</span>
                      {isSelected && (
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={14} color="#fff" />
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {theme.description}
                    </p>
                    <div style={{
                      marginTop: '12px',
                      height: '6px',
                      borderRadius: '3px',
                      background: theme.borderGradient
                    }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Color Selection */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🌈</span> 2. 인화지 배경 색상
            </h3>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              {FRAME_COLORS.map((c) => {
                const isSelected = selectedColor.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      sound.playPop();
                      setSelectedColor(c);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 18px',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: c.value,
                      border: `1.5px solid ${c.border}`,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }} />
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{c.name}</span>
                    {isSelected && <Check size={14} color="#38bdf8" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Layout Selection */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📐</span> 3. 네컷 사진 레이아웃
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              {FRAME_LAYOUTS.map((layout) => {
                const isSelected = selectedLayout.id === layout.id;
                const Icon = layout.id === 'grid_2x2' ? LayoutGrid : Columns;
                return (
                  <div
                    key={layout.id}
                    onClick={() => {
                      sound.playPop();
                      setSelectedLayout(layout);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px',
                      borderRadius: '14px',
                      background: isSelected ? 'rgba(236, 72, 153, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '2px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: isSelected ? '#ec4899' : 'rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={22} color="#ffffff" />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{layout.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{layout.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Live Mockup Preview */}
        <div style={{ position: 'sticky', top: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '14px' }}>
              미리보기 (Preview)
            </div>

            {/* Frame Mockup Card */}
            <div style={{
              width: '280px',
              margin: '0 auto',
              background: selectedColor.value,
              color: selectedColor.text,
              borderRadius: '12px',
              padding: '16px 14px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              border: `2px solid ${selectedColor.border}`,
              transition: 'all 0.3s ease'
            }}>
              {/* Top Header */}
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>
                  {selectedTheme.headerText}
                </div>
              </div>

              {/* Photos Placeholder */}
              {selectedLayout.id === 'grid_2x2' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '10px' }}>
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      style={{
                        aspectRatio: '4/3',
                        background: 'rgba(0, 0, 0, 0.08)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        color: 'rgba(0, 0, 0, 0.4)',
                        fontWeight: 700
                      }}
                    >
                      CUT #{n}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', gap: '6px', marginBottom: '10px' }}>
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      style={{
                        height: '52px',
                        background: 'rgba(0, 0, 0, 0.08)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        color: 'rgba(0, 0, 0, 0.4)',
                        fontWeight: 700
                      }}
                    >
                      CUT #{n}
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Footer & QR placeholder */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '6px',
                borderTop: '1px dashed rgba(0,0,0,0.15)',
                fontSize: '9px',
                fontWeight: 600
              }}>
                <div style={{ textAlign: 'left', maxWidth: '200px' }}>
                  <div>{selectedTheme.footerText}</div>
                  <div style={{ fontSize: '8px', opacity: 0.7 }}>2026.10.20 • PHOTO BOOTH</div>
                </div>
                <div style={{
                  width: '26px',
                  height: '26px',
                  background: '#000',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '8px',
                  fontWeight: 800
                }}>
                  QR
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={() => {
                sound.playPop();
                onNext();
              }}
              className="btn btn-primary btn-lg pulse-glow"
              style={{ width: '100%', marginTop: '24px', gap: '10px' }}
            >
              <span>4컷 촬영하러 가기</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
