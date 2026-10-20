import React, { useState, useEffect } from 'react';
import { Sparkles, Camera, ChevronRight, Star, Settings } from 'lucide-react';
import { sound } from '../utils/soundEffects';

const ATTRACT_MESSAGES = [
  '나만의 2022 개정 영어과 네컷사진을 찍어보세요! 📸',
  '세특 스티커로 미래 진로를 꾸며보세요! 🔬',
  '5대 카테고리 스티커로 취향껏 꾸미기! 🎨',
  'QR 코드로 스마트폰에 바로 저장! 📱',
  '사진 출력까지 단 3분이면 완성! 🖨️',
];

export default function LandingScreen({ onStart, onOpenSettings }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [bgAnimated, setBgAnimated] = useState(false);

  useEffect(() => {
    // Animated stars/particles background
    setBgAnimated(true);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIdx(prev => (prev + 1) % ATTRACT_MESSAGES.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { emoji: '🎨', num: 1, title: '프레임 선택', desc: '테마·색상·레이아웃' },
    { emoji: '📸', num: 2, title: '4컷 촬영', desc: '카운트다운 자동 6연사' },
    { emoji: '✨', num: 3, title: '스티커 꾸미기', desc: '세특·과목·위트 스티커' },
    { emoji: '🖨️', num: 4, title: '인쇄 & QR 저장', desc: '프린터 출력 + 스마트폰' },
  ];

  return (
    <div
      onClick={() => { sound.init(); }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Right Settings Button */}
      <div style={{ position: 'absolute', top: '24px', right: '28px', zIndex: 60 }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playPop();
            onOpenSettings && onOpenSettings();
          }}
          className="btn btn-secondary"
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
          }}
          title="포토부스 설정 (외부 스티커 등록 & 옵션)"
        >
          <Settings size={16} color="#ec4899" />
          <span style={{ fontSize: '13px', fontWeight: 700 }}>설정</span>
        </button>
      </div>
      {/* Ambient background glows */}
      <div style={{ position: 'absolute', top: '-160px', left: '-160px', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-160px', right: '-160px', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Floating star decorations */}
      {[
        { top: '8%', left: '6%', size: 18, delay: '0s', opacity: 0.6 },
        { top: '12%', right: '8%', size: 14, delay: '0.8s', opacity: 0.5 },
        { bottom: '18%', left: '4%', size: 22, delay: '1.4s', opacity: 0.4 },
        { bottom: '12%', right: '6%', size: 16, delay: '0.4s', opacity: 0.55 },
        { top: '45%', left: '3%', size: 12, delay: '1.8s', opacity: 0.35 },
        { top: '35%', right: '3%', size: 20, delay: '1.0s', opacity: 0.45 },
      ].map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: s.top, left: s.left, bottom: s.bottom, right: s.right,
          opacity: s.opacity,
          animation: `pulseGlow 3s ${s.delay} infinite ease-in-out`,
          pointerEvents: 'none',
        }}>
          <Star size={s.size} color="#818cf8" fill="#818cf8" />
        </div>
      ))}

      {/* Hero Logo */}
      <div style={{
        width: '100px', height: '100px', borderRadius: '30px', marginBottom: '28px',
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '52px',
        boxShadow: '0 0 40px rgba(99,102,241,0.55), 0 0 80px rgba(236,72,153,0.35)',
        animation: 'pulseGlow 3s infinite ease-in-out',
      }}>
        📸
      </div>

      {/* Main Title */}
      <h1 className="hero-title-gradient" style={{
        fontSize: 'clamp(38px, 5vw, 58px)',
        fontWeight: 900,
        fontFamily: 'var(--font-display)',
        lineHeight: 1.1,
        background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 40%, #fbcfe8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '12px',
        letterSpacing: '-1.5px',
      }}>
        Find Your<br />English Spectrum!
      </h1>

      <p style={{
        fontSize: '17px',
        color: 'rgba(255,255,255,0.6)',
        fontWeight: 500,
        marginBottom: '24px',
        maxWidth: '520px',
        lineHeight: 1.6,
      }}>
        2022 개정 영어과 선택과목 & 세특 탐구 체험 부스<br />
        <span style={{ color: '#a5b4fc', fontWeight: 700 }}>디지털 네컷사진 스티커 키오스크</span>
      </p>

      {/* Rolling Attract Message */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 22px',
        borderRadius: '20px',
        background: 'rgba(99,102,241,0.12)',
        border: '1px solid rgba(99,102,241,0.28)',
        marginBottom: '40px',
        minHeight: '44px',
      }}>
        <Sparkles size={15} color="#818cf8" />
        <span style={{
          fontSize: '14.5px',
          fontWeight: 600,
          color: '#c7d2fe',
          transition: 'opacity 0.4s ease',
          opacity: visible ? 1 : 0,
        }}>
          {ATTRACT_MESSAGES[msgIdx]}
        </span>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => {
          sound.playSuccess();
          onStart();
        }}
        className="btn btn-primary pulse-glow"
        style={{
          padding: '20px 52px',
          fontSize: '22px',
          borderRadius: '22px',
          gap: '14px',
          marginBottom: '52px',
          boxShadow: '0 0 35px rgba(99,102,241,0.55), 0 8px 24px rgba(0,0,0,0.4)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.3px',
        }}
      >
        <Camera size={27} />
        <span>촬영 시작하기</span>
        <ChevronRight size={24} />
      </button>

      {/* 4-Step Flow Overview */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="glass-panel-subtle" style={{
              padding: '18px 22px',
              borderRadius: '18px',
              textAlign: 'center',
              minWidth: '148px',
              transition: 'transform 0.2s ease',
            }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>{step.emoji}</div>
              <div style={{
                display: 'inline-block',
                padding: '2px 10px',
                borderRadius: '8px',
                background: 'rgba(99,102,241,0.2)',
                fontSize: '11px',
                fontWeight: 700,
                color: '#a5b4fc',
                marginBottom: '6px',
              }}>
                STEP {step.num}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>
                {step.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {step.desc}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight size={20} color="rgba(255,255,255,0.2)" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tap anywhere hint */}
      <p style={{ marginTop: '32px', fontSize: '12px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.5px' }}>
        화면을 터치하거나 버튼을 눌러 시작하세요
      </p>
    </div>
  );
}
