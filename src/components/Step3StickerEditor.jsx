import React, { useState, useRef, useEffect } from 'react';
import { STICKER_CATEGORIES, STICKER_DATA } from '../constants/stickers';
import { sound } from '../utils/soundEffects';
import { 
  Trash2, ArrowUp, ArrowDown, Type, Sparkles, Clock, 
  RotateCw, RotateCcw, ZoomIn, ZoomOut, ArrowRight, ArrowLeft, RefreshCw,
  ImagePlus, Settings
} from 'lucide-react';

export default function Step3StickerEditor({
  capturedPhotos,
  selectedTheme,
  selectedColor,
  selectedLayout,
  stickers,
  setStickers,
  customStickers = [],
  appSettings = {},
  onOpenSettings,
  onNext,
  onPrev,
}) {
  const [activeCategory, setActiveCategory] = useState('deco'); // 데코/소품 누끼 스티커 기본 표시
  const [selectedStickerId, setSelectedStickerId] = useState(null);
  const [customText, setCustomText] = useState('');
  
  const initialTimeLimit = appSettings.stickerTimeLimit !== undefined ? appSettings.stickerTimeLimit : 90;
  const isUnlimited = initialTimeLimit === 0;
  const [timeLeft, setTimeLeft] = useState(initialTimeLimit);

  // Use a ref so the timer closure always has the latest onNext
  const onNextRef = useRef(onNext);
  useEffect(() => { onNextRef.current = onNext; }, [onNext]);

  const canvasContainerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isTransformingRef = useRef(null); // 'rotate' | 'scale'
  const dragStartRef = useRef({ x: 0, y: 0, stickerX: 0, stickerY: 0, scale: 1, rotation: 0, initialAngle: 0, initialDist: 1 });

  // 제한시간 카운트다운 (0인 경우 무제한)
  useEffect(() => {
    if (isUnlimited) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          sound.playSuccess();
          onNextRef.current();
          return 0;
        }
        if (prev === 10) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isUnlimited]);

  // 스티커 추가 (적정 기본 크기로 사진을 가리지 않게 배치)
  const handleAddSticker = (item) => {
    if (stickers.length >= 14) {
      alert('더 깔끔한 사진 출력을 위해 스티커는 최대 14개까지 부착할 수 있습니다!');
      return;
    }
    sound.playPop();

    // 캔버스 중앙 근처에 자연스러운 위치로 배치
    const offset = (Math.random() - 0.5) * 50;
    const newSticker = {
      instanceId: 'stk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      id: item.id,
      name: item.name,
      src: item.src,
      x: 180 + offset,
      y: 220 + offset,
      scale: 1,
      rotation: Math.round((Math.random() - 0.5) * 12),
      width: item.defaultWidth || 90,
    };

    setStickers([...stickers, newSticker]);
    setSelectedStickerId(newSticker.instanceId);
  };

  // 커스텀 텍스트 스티커 추가 (누끼 다이컷 스타일)
  const handleAddCustomTextSticker = (e) => {
    e.preventDefault();
    if (!customText.trim()) return;
    if (stickers.length >= 14) {
      alert('스티커는 최대 14개까지 추가 가능합니다.');
      return;
    }

    sound.playPop();
    const cleanText = customText.trim();
    const textSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="135" height="40" viewBox="0 0 135 40">
      <defs>
        <filter id="nukkiShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="%23000000" flood-opacity="0.3"/>
        </filter>
        <linearGradient id="customGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="%23ec4899"/>
          <stop offset="100%" stop-color="%238b5cf6"/>
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="129" height="34" rx="17" fill="url(%23customGrad)" stroke="%23ffffff" stroke-width="2.5" filter="url(%23nukkiShadow)"/>
      <text x="67" y="21" fill="%23ffffff" font-family="'Pretendard', sans-serif" font-weight="900" font-size="12" text-anchor="middle" dominant-baseline="central">✨ ${encodeURIComponent(cleanText)}</text>
    </svg>`;

    const newSticker = {
      instanceId: 'stk_' + Date.now(),
      id: 'custom_text',
      name: cleanText,
      src: textSvg,
      x: 180,
      y: 220,
      scale: 1,
      rotation: 0,
      width: 100,
    };

    setStickers([...stickers, newSticker]);
    setSelectedStickerId(newSticker.instanceId);
    setCustomText('');
  };

  // 스티커 삭제
  const handleDeleteSelected = () => {
    if (!selectedStickerId) return;
    sound.playPop();
    setStickers(stickers.filter(s => s.instanceId !== selectedStickerId));
    setSelectedStickerId(null);
  };

  // 레이어 위로/아래로 이동
  const handleBringForward = () => {
    if (!selectedStickerId) return;
    const idx = stickers.findIndex(s => s.instanceId === selectedStickerId);
    if (idx === -1 || idx === stickers.length - 1) return;
    sound.playPop();
    const newArr = [...stickers];
    const item = newArr.splice(idx, 1)[0];
    newArr.push(item);
    setStickers(newArr);
  };

  const handleSendBackward = () => {
    if (!selectedStickerId) return;
    const idx = stickers.findIndex(s => s.instanceId === selectedStickerId);
    if (idx <= 0) return;
    sound.playPop();
    const newArr = [...stickers];
    const item = newArr.splice(idx, 1)[0];
    newArr.unshift(item);
    setStickers(newArr);
  };

  // 1-Click 미세조절 버튼 (확대/축소/회전/리셋)
  const handleScaleStep = (delta) => {
    if (!selectedStickerId) return;
    sound.playPop();
    setStickers(prev => prev.map(s => {
      if (s.instanceId === selectedStickerId) {
        const nextScale = Math.max(0.35, Math.min(2.5, +(s.scale + delta).toFixed(2)));
        return { ...s, scale: nextScale };
      }
      return s;
    }));
  };

  const handleRotateStep = (deg) => {
    if (!selectedStickerId) return;
    sound.playPop();
    setStickers(prev => prev.map(s => {
      if (s.instanceId === selectedStickerId) {
        return { ...s, rotation: (s.rotation + deg) % 360 };
      }
      return s;
    }));
  };

  const handleResetTransform = () => {
    if (!selectedStickerId) return;
    sound.playPop();
    setStickers(prev => prev.map(s => {
      if (s.instanceId === selectedStickerId) {
        return { ...s, scale: 1, rotation: 0 };
      }
      return s;
    }));
  };

  // 포인터 이벤트 기반 드래그 제어
  const handlePointerDownSticker = (e, sticker) => {
    e.stopPropagation();
    setSelectedStickerId(sticker.instanceId);
    isDraggingRef.current = true;
    isTransformingRef.current = null;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    dragStartRef.current = {
      x: clientX,
      y: clientY,
      stickerX: sticker.x,
      stickerY: sticker.y,
      scale: sticker.scale,
      rotation: sticker.rotation,
    };
  };

  // 회전 및 스케일 핸들 터치/클릭
  const handlePointerDownHandle = (e, type, sticker) => {
    e.stopPropagation();
    if (e.cancelable) e.preventDefault();
    isDraggingRef.current = false;
    isTransformingRef.current = type; // 'scale' or 'rotate'

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // 스티커의 중심 좌표 구하기
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + sticker.x;
    const centerY = rect.top + sticker.y;

    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    const dist = Math.hypot(clientX - centerX, clientY - centerY);

    dragStartRef.current = {
      x: clientX,
      y: clientY,
      scale: sticker.scale,
      rotation: sticker.rotation,
      initialAngle: angle,
      initialDist: dist,
    };
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!selectedStickerId) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (isDraggingRef.current) {
        if (e.touches && e.cancelable) e.preventDefault();
        const dx = clientX - dragStartRef.current.x;
        const dy = clientY - dragStartRef.current.y;

        setStickers(prev => prev.map(s => {
          if (s.instanceId === selectedStickerId) {
            return {
              ...s,
              x: Math.max(0, Math.min(360, dragStartRef.current.stickerX + dx)),
              y: Math.max(0, Math.min(520, dragStartRef.current.stickerY + dy)),
            };
          }
          return s;
        }));
      } else if (isTransformingRef.current === 'scale') {
        if (e.touches && e.cancelable) e.preventDefault();
        const rect = canvasContainerRef.current.getBoundingClientRect();
        const currentSticker = stickers.find(s => s.instanceId === selectedStickerId);
        if (!currentSticker) return;

        const centerX = rect.left + currentSticker.x;
        const centerY = rect.top + currentSticker.y;
        const currentDist = Math.hypot(clientX - centerX, clientY - centerY);

        const ratio = currentDist / (dragStartRef.current.initialDist || 1);
        const newScale = Math.max(0.35, Math.min(2.5, +(dragStartRef.current.scale * ratio).toFixed(2)));

        setStickers(prev => prev.map(s => {
          if (s.instanceId === selectedStickerId) {
            return { ...s, scale: newScale };
          }
          return s;
        }));
      } else if (isTransformingRef.current === 'rotate') {
        if (e.touches && e.cancelable) e.preventDefault();
        const rect = canvasContainerRef.current.getBoundingClientRect();
        const currentSticker = stickers.find(s => s.instanceId === selectedStickerId);
        if (!currentSticker) return;

        const centerX = rect.left + currentSticker.x;
        const centerY = rect.top + currentSticker.y;
        const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
        const deltaAngle = currentAngle - dragStartRef.current.initialAngle;

        setStickers(prev => prev.map(s => {
          if (s.instanceId === selectedStickerId) {
            return { ...s, rotation: Math.round((dragStartRef.current.rotation + deltaAngle) % 360) };
          }
          return s;
        }));
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      isTransformingRef.current = null;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [selectedStickerId, stickers]);

  const selectedSticker = stickers.find(s => s.instanceId === selectedStickerId);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '10px 24px 40px' }}>
      {/* Top Header & 90s Timer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎀</span> 누끼 스티커 & 소품 꾸미기
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            사진을 가리지 않는 깔끔한 투명 누끼 스티커를 얼굴과 사진 위에 자유롭게 붙여보세요!
          </p>
        </div>

        {/* Countdown Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          borderRadius: '24px',
          background: isUnlimited ? 'rgba(16, 185, 129, 0.15)' : timeLeft <= 15 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(99, 102, 241, 0.15)',
          border: isUnlimited ? '1px solid rgba(16, 185, 129, 0.3)' : timeLeft <= 15 ? '1px solid #ef4444' : '1px solid rgba(99, 102, 241, 0.3)',
          color: isUnlimited ? '#6ee7b7' : timeLeft <= 15 ? '#fca5a5' : '#c7d2fe',
          fontWeight: 700,
          fontSize: '14px'
        }}>
          <Clock size={16} color={isUnlimited ? '#10b981' : timeLeft <= 15 ? '#ef4444' : '#818cf8'} />
          <span>{isUnlimited ? '남은 시간: 무제한 ♾️' : `남은 시간: ${timeLeft}초`}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '28px', alignItems: 'start' }}>
        
        {/* Left: Interactive Canvas Viewport */}
        <div>
          <div className="glass-panel" style={{ padding: '18px', textAlign: 'center' }}>
            <div
              ref={canvasContainerRef}
              onClick={() => setSelectedStickerId(null)}
              style={{
                width: '360px',
                height: '520px',
                margin: '0 auto',
                background: selectedColor.value,
                color: selectedColor.text,
                borderRadius: '14px',
                padding: '16px 14px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                border: `2px solid ${selectedColor.border}`,
                position: 'relative',
                overflow: 'hidden',
                userSelect: 'none',
              }}
            >
              {/* Frame Title */}
              <div style={{ textAlign: 'center', marginBottom: '8px', pointerEvents: 'none' }}>
                <div style={{ fontSize: '12px', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '0.4px' }}>
                  {selectedTheme.headerText}
                </div>
              </div>

              {/* Photos Layout */}
              {selectedLayout.id === 'grid_2x2' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '8px', pointerEvents: 'none' }}>
                  {capturedPhotos.map((photo, i) => (
                    <div key={i} style={{ aspectRatio: '4/3', borderRadius: '4px', overflow: 'hidden', background: '#222' }}>
                      <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', gap: '6px', marginBottom: '8px', pointerEvents: 'none' }}>
                  {capturedPhotos.map((photo, i) => (
                    <div key={i} style={{ height: '82px', borderRadius: '4px', overflow: 'hidden', background: '#222' }}>
                      <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Frame Footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '6px',
                borderTop: '1px dashed rgba(0,0,0,0.15)',
                fontSize: '10px',
                fontWeight: 600,
                pointerEvents: 'none'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div>{selectedTheme.footerText}</div>
                  <div style={{ fontSize: '9px', opacity: 0.7 }}>Find Your English Spectrum! 📸</div>
                </div>
                <div style={{ width: '28px', height: '28px', background: '#000', borderRadius: '3px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800 }}>
                  QR
                </div>
              </div>

              {/* Placed Stickers Layer */}
              {stickers.map((s) => {
                const isSelected = s.instanceId === selectedStickerId;
                return (
                  <div
                    key={s.instanceId}
                    onMouseDown={(e) => handlePointerDownSticker(e, s)}
                    onTouchStart={(e) => handlePointerDownSticker(e, s)}
                    style={{
                      position: 'absolute',
                      left: `${s.x}px`,
                      top: `${s.y}px`,
                      transform: `translate(-50%, -50%) rotate(${s.rotation}deg) scale(${s.scale})`,
                      cursor: 'grab',
                      zIndex: isSelected ? 30 : 10,
                      touchAction: 'none',
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      border: isSelected ? '2px dashed #ec4899' : '2px solid transparent',
                      padding: '2px',
                      borderRadius: '6px',
                    }}>
                      <img
                        src={s.src}
                        alt={s.name}
                        style={{
                          width: `${s.width}px`,
                          display: 'block',
                          pointerEvents: 'none',
                        }}
                      />

                      {/* Transform Controls when selected */}
                      {isSelected && (
                        <>
                          {/* Rotate Handle (Top Right) */}
                          <div
                            onMouseDown={(e) => handlePointerDownHandle(e, 'rotate', s)}
                            onTouchStart={(e) => handlePointerDownHandle(e, 'rotate', s)}
                            title="회전 드래그"
                            style={{
                              position: 'absolute',
                              top: '-14px',
                              right: '-14px',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: '#6366f1',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'grab',
                              boxShadow: '0 3px 8px rgba(0,0,0,0.4)',
                              zIndex: 40,
                              touchAction: 'none',
                            }}
                          >
                            <RotateCw size={14} />
                          </div>

                          {/* Scale Handle (Bottom Right) */}
                          <div
                            onMouseDown={(e) => handlePointerDownHandle(e, 'scale', s)}
                            onTouchStart={(e) => handlePointerDownHandle(e, 'scale', s)}
                            title="크기 조절 드래그"
                            style={{
                              position: 'absolute',
                              bottom: '-14px',
                              right: '-14px',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: '#ec4899',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'nwse-resize',
                              boxShadow: '0 3px 8px rgba(0,0,0,0.4)',
                              zIndex: 40,
                              touchAction: 'none',
                            }}
                          >
                            <ZoomIn size={14} />
                          </div>

                          {/* Delete Button (Top Left) */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSelected();
                            }}
                            title="스티커 삭제"
                            style={{
                              position: 'absolute',
                              top: '-14px',
                              left: '-14px',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: '#ef4444',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 3px 8px rgba(0,0,0,0.4)',
                              zIndex: 40,
                              fontWeight: 900,
                              fontSize: '13px',
                            }}
                          >
                            ✕
                          </div>

                          {/* Reset Button (Bottom Left) */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResetTransform();
                            }}
                            title="원래 크기/각도로 리셋"
                            style={{
                              position: 'absolute',
                              bottom: '-14px',
                              left: '-14px',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: '#475569',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 3px 8px rgba(0,0,0,0.4)',
                              zIndex: 40,
                            }}
                          >
                            <RefreshCw size={13} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Sticker Quick Control Toolbar */}
            {selectedSticker ? (
              <div style={{
                marginTop: '14px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#c7d2fe', fontWeight: 700 }}>
                  <span>선택된 스티커: {selectedSticker.name}</span>
                  <span style={{ fontSize: '11px', opacity: 0.8 }}>배율: {Math.round(selectedSticker.scale * 100)}% | 회전: {selectedSticker.rotation}°</span>
                </div>

                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {/* Scale Down */}
                  <button
                    onClick={() => handleScaleStep(-0.15)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                    title="15% 축소"
                  >
                    <ZoomOut size={13} /> 축소
                  </button>
                  {/* Scale Up */}
                  <button
                    onClick={() => handleScaleStep(0.15)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                    title="15% 확대"
                  >
                    <ZoomIn size={13} /> 확대
                  </button>
                  {/* Rotate Left */}
                  <button
                    onClick={() => handleRotateStep(-15)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                    title="15도 좌회전"
                  >
                    <RotateCcw size={13} /> -15°
                  </button>
                  {/* Rotate Right */}
                  <button
                    onClick={() => handleRotateStep(15)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                    title="15도 우회전"
                  >
                    <RotateCw size={13} /> +15°
                  </button>
                  {/* Layer Up */}
                  <button
                    onClick={handleBringForward}
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                    title="맨 앞으로"
                  >
                    <ArrowUp size={13} /> 맨앞
                  </button>
                  {/* Layer Down */}
                  <button
                    onClick={handleSendBackward}
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                    title="맨 뒤로"
                  >
                    <ArrowDown size={13} /> 맨뒤
                  </button>
                  {/* Delete */}
                  <button
                    onClick={handleDeleteSelected}
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '12px', color: '#ef4444' }}
                    title="삭제"
                  >
                    <Trash2 size={13} /> 삭제
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--text-secondary)', padding: '6px' }}>
                💡 스티커를 클릭하면 확대/축소, 회전, 순서 조절 버튼이 나타납니다.
              </div>
            )}
          </div>
        </div>

        {/* Right: Sticker Palettes & Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Custom Text Sticker Input */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Type size={16} color="#ec4899" />
              <span>직접 입력 세특 / 진로 문구 누끼 스티커</span>
            </div>
            <form onSubmit={handleAddCustomTextSticker} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="예: 생명과학 연구원 / 영문학과 지망생"
                maxLength={18}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '13px' }}>
                스티커 생성 ➕
              </button>
            </form>
          </div>

          {/* Category Tabs & Sticker Palette */}
          {(() => {
            const allCategories = [
              ...STICKER_CATEGORIES,
              { id: 'custom', label: `내가 등록한 스티커 🌟 (${customStickers.length})` },
            ];
            const combinedStickers = [...customStickers, ...STICKER_DATA];
            const displayedStickers = activeCategory === 'custom'
              ? customStickers
              : combinedStickers.filter(s => s.category === activeCategory);

            return (
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', alignItems: 'center' }}>
                  {allCategories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          sound.playPop();
                          setActiveCategory(cat.id);
                        }}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '10px',
                          background: isActive ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'rgba(255, 255, 255, 0.05)',
                          border: isActive ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.08)',
                          color: isActive ? '#fff' : 'var(--text-secondary)',
                          fontWeight: 700,
                          fontSize: '13px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {cat.label}
                      </button>
                    );
                  })}

                  {/* Open Settings Modal Shortcut */}
                  <button
                    onClick={() => {
                      sound.playPop();
                      onOpenSettings && onOpenSettings();
                    }}
                    className="btn btn-secondary"
                    style={{
                      padding: '7px 14px',
                      borderRadius: '10px',
                      gap: '6px',
                      fontSize: '12px',
                      color: '#f472b6',
                      border: '1px solid rgba(236, 72, 153, 0.35)',
                      background: 'rgba(236, 72, 153, 0.1)',
                      whiteSpace: 'nowrap',
                      marginLeft: 'auto',
                    }}
                    title="외부 스티커 등록 및 스티커 디자인 설정 열기"
                  >
                    <ImagePlus size={14} color="#ec4899" />
                    <span>+ 외부 스티커 등록</span>
                  </button>
                </div>

                {/* Sticker Grid Items */}
                {displayedStickers.length === 0 ? (
                  <div style={{
                    padding: '36px 16px',
                    textAlign: 'center',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px dashed rgba(255, 255, 255, 0.15)',
                    margin: '12px 4px',
                  }}>
                    <div style={{ fontSize: '30px', marginBottom: '8px' }}>🎨</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                      등록된 외부 스티커가 없습니다
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                      [+ 외부 스티커 등록] 버튼을 눌러 PNG/SVG 이미지나 직접 디자인한 스티커를 추가해보세요!
                    </p>
                    <button
                      onClick={() => onOpenSettings && onOpenSettings()}
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      <ImagePlus size={14} />
                      <span>스티커 등록 창 열기</span>
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    maxHeight: '340px',
                    overflowY: 'auto',
                    padding: '12px 4px',
                  }}>
                    {displayedStickers.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleAddSticker(item)}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          minHeight: '85px',
                          position: 'relative',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
                      >
                        {item.isExternal && (
                          <span style={{
                            position: 'absolute',
                            top: '4px',
                            left: '6px',
                            fontSize: '9px',
                            background: 'rgba(236, 72, 153, 0.25)',
                            color: '#f472b6',
                            border: '1px solid rgba(236, 72, 153, 0.4)',
                            borderRadius: '4px',
                            padding: '1px 4px',
                            fontWeight: 700,
                          }}>
                            외부 등록
                          </span>
                        )}
                        <img src={item.src} alt={item.name} style={{ width: '85px', height: 'auto', display: 'block', maxHeight: '50px', objectFit: 'contain' }} />
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600, textAlign: 'center' }}>
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Navigation Controls */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button
              onClick={() => {
                sound.playPop();
                onPrev();
              }}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '14px' }}
            >
              <ArrowLeft size={18} /> 재촬영
            </button>
            <button
              onClick={() => {
                sound.playSuccess();
                onNext();
              }}
              className="btn btn-primary pulse-glow"
              style={{ flex: 1.8, padding: '14px', fontSize: '16px' }}
            >
              <span>완성 및 사진 출력하기</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
