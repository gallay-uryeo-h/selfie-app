import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, RotateCcw, ArrowRight, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { generateSamplePhoto } from '../utils/samplePhotos';

const TOTAL_SHOTS = 6;
const COUNTDOWN_SECONDS = 3;

export default function Step2CameraCapture({ capturedPhotos, setCapturedPhotos, onNext, onPrev, appSettings = {} }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [useVirtualCam, setUseVirtualCam] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const [isShooting, setIsShooting] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [currentShotIdx, setCurrentShotIdx] = useState(0);
  const [allPhotos, setAllPhotos] = useState([]);
  const [showFlash, setShowFlash] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);

  const countdownSeconds = appSettings.countdownSeconds || COUNTDOWN_SECONDS;

  // ── Camera init ──────────────────────────────────────────
  useEffect(() => {
    let alive = true;

    const tryStart = async () => {
      if (useVirtualCam) { setCameraReady(true); return; }
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 960 }, facingMode: 'user' },
          audio: false,
        });
        if (!alive) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraReady(true);
      } catch (err) {
        console.warn('Webcam not available, switching to demo mode:', err.message);
        setCameraError('웹캠을 찾을 수 없어 데모 모드로 실행합니다.');
        setUseVirtualCam(true);
      }
    };

    tryStart();
    return () => {
      alive = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [useVirtualCam]);

  // ── Capture a single frame ───────────────────────────────
  const captureFrame = useCallback((idx) => {
    setShowFlash(true);
    sound.playShutter();
    setTimeout(() => setShowFlash(false), 280);

    if (useVirtualCam || !videoRef.current?.videoWidth) {
      return generateSamplePhoto(idx);
    }
    const v = videoRef.current;
    const c = document.createElement('canvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext('2d');
    ctx.translate(c.width, 0); ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0);
    return c.toDataURL('image/jpeg', 0.93);
  }, [useVirtualCam]);

  // ── Burst session ────────────────────────────────────────
  const startBurst = useCallback(() => {
    sound.playPop();
    setIsShooting(true);
    setSessionDone(false);
    setAllPhotos([]);
    setCapturedPhotos([]);

    const taken = [];

    const doShot = (idx) => {
      if (idx >= TOTAL_SHOTS) {
        setIsShooting(false);
        setCountdown(null);
        setSessionDone(true);
        // Auto-fill first 4 as selection
        setCapturedPhotos(taken.slice(0, 4));
        sound.playSuccess();
        return;
      }

      setCurrentShotIdx(idx);
      let t = countdownSeconds;
      setCountdown(t);
      sound.playTick();

      const tick = setInterval(() => {
        t -= 1;
        if (t > 0) {
          setCountdown(t);
          sound.playTick();
        } else {
          clearInterval(tick);
          setCountdown(0); // triggers "CHEESE!" display
          setTimeout(() => {
            const photo = captureFrame(idx);
            taken.push(photo);
            setAllPhotos([...taken]);
            setCountdown(null);
            setTimeout(() => doShot(idx + 1), 900);
          }, 200);
        }
      }, 1000);
    };

    doShot(0);
  }, [captureFrame, setCapturedPhotos]);

  // ── Photo selection toggle ───────────────────────────────
  const toggleSelect = (photo) => {
    sound.playPop();
    if (capturedPhotos.includes(photo)) {
      setCapturedPhotos(prev => prev.filter(p => p !== photo));
    } else {
      if (capturedPhotos.length >= 4) {
        // Replace last selected
        setCapturedPhotos(prev => [...prev.slice(0, 3), photo]);
      } else {
        setCapturedPhotos(prev => [...prev, photo]);
      }
    }
  };

  const canProceed = capturedPhotos.length === 4;

  return (
    <div style={{ maxWidth: '1260px', margin: '0 auto', padding: '10px 24px 36px' }}>
      {/* Shutter flash */}
      {showFlash && <div className="flash-overlay" />}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '22px' }}>
        <div className="badge badge-indigo" style={{ marginBottom: '10px' }}>
          <Camera size={14} /> STEP 2 — 카메라 촬영 & 4컷 선택
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '6px' }}>
          {isShooting
            ? `📸 촬영 중 — ${currentShotIdx + 1} / ${TOTAL_SHOTS} 컷`
            : sessionDone
            ? '✅ 촬영 완료! 마음에 드는 4컷을 골라주세요'
            : '카메라를 향해 웃어주세요! 😊'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          {TOTAL_SHOTS}회 자동 연속 촬영 후 Best 4컷을 선택하면 스티커 꾸미기로 넘어갑니다.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'start' }}>

        {/* ── Left: Camera Viewfinder ─────────────────── */}
        <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>

          {/* Status bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '9px', height: '9px', borderRadius: '50%',
                background: isShooting ? '#ef4444' : cameraReady ? '#10b981' : '#f59e0b',
                display: 'inline-block',
                boxShadow: isShooting ? '0 0 6px #ef4444' : undefined,
              }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                {useVirtualCam ? '✨ 데모 카메라 모드' : '🎥 HD 웹캠 라이브뷰'}
              </span>
              {cameraError && (
                <span style={{ fontSize: '11px', color: '#fbbf24', background: 'rgba(251,191,36,0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                  {cameraError}
                </span>
              )}
            </div>

            <button
              onClick={() => { sound.playPop(); setUseVirtualCam(v => !v); setCameraReady(false); }}
              className="btn btn-secondary btn-sm"
            >
              {useVirtualCam ? '🎥 실제 웹캠 시도' : '✨ 데모 모드'}
            </button>
          </div>

          {/* Viewfinder */}
          <div style={{
            position: 'relative',
            aspectRatio: '4/3',
            background: '#000',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 24px rgba(0,0,0,0.8)',
          }}>
            {!useVirtualCam ? (
              <video
                ref={videoRef}
                autoPlay playsInline muted
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
              />
            ) : (
              /* Virtual cam idle / shooting preview */
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: isShooting
                  ? `linear-gradient(135deg, hsl(${currentShotIdx * 50}, 70%, 20%) 0%, hsl(${currentShotIdx * 50 + 60}, 70%, 30%) 100%)`
                  : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                transition: 'background 0.5s ease',
              }}>
                <div style={{ fontSize: '80px', marginBottom: '16px', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }}>
                  {isShooting
                    ? ['✌️', '😎', '🫰', '✨', '📚', '🎓'][currentShotIdx]
                    : '📸'}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#c7d2fe' }}>
                  {isShooting ? `CUT #${currentShotIdx + 1} 촬영 준비` : '데모 카메라 대기 중'}
                </div>
              </div>
            )}

            {/* Countdown overlay */}
            {countdown !== null && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                zIndex: 20,
              }}>
                {countdown > 0 ? (
                  <div
                    key={countdown}
                    className="countdown-number"
                    style={{
                      fontSize: '140px',
                      fontWeight: 900,
                      fontFamily: 'var(--font-display)',
                      color: '#ffffff',
                      textShadow: '0 0 50px rgba(236,72,153,0.9)',
                      lineHeight: 1,
                    }}
                  >
                    {countdown}
                  </div>
                ) : (
                  <div style={{
                    fontSize: '52px', fontWeight: 900,
                    fontFamily: 'var(--font-display)',
                    color: '#fbbf24',
                    textShadow: '0 0 30px rgba(251,191,36,0.8)',
                    letterSpacing: '2px',
                  }}>
                    CHEESE! 🧀
                  </div>
                )}

                <div style={{ marginTop: '14px', fontSize: '16px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                  {countdown > 0 ? `${currentShotIdx + 1} / ${TOTAL_SHOTS} 컷` : '찰칵!'}
                </div>
              </div>
            )}

            {/* Viewfinder guide lines */}
            <div style={{ position: 'absolute', inset: '18px', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '6px', pointerEvents: 'none' }} />

            {/* Shot progress dots */}
            <div style={{
              position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '7px',
            }}>
              {Array.from({ length: TOTAL_SHOTS }).map((_, i) => (
                <div key={i} style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: i < allPhotos.length ? '#10b981' : isShooting && i === currentShotIdx ? '#ec4899' : 'rgba(255,255,255,0.25)',
                  boxShadow: i < allPhotos.length ? '0 0 5px #10b981' : undefined,
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
          </div>

          {/* Shoot Controls */}
          <div style={{ marginTop: '18px', display: 'flex', gap: '12px' }}>
            <button
              onClick={startBurst}
              disabled={isShooting}
              className="btn btn-accent btn-lg pulse-glow"
              style={{ flex: 1, opacity: isShooting ? 0.5 : 1 }}
            >
              {isShooting ? (
                <><div className="spinner" style={{ width: 22, height: 22, borderWidth: 2 }} /> 촬영 중...</>
              ) : allPhotos.length > 0 ? (
                <><RotateCcw size={20} /> 전체 재촬영</>
              ) : (
                <><Zap size={22} /> {TOTAL_SHOTS}컷 연속 촬영 시작!</>
              )}
            </button>
          </div>
        </div>

        {/* ── Right: 4-slot picker + Gallery ────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* 4 Selected slots */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700 }}>
                🎯 선택된 네컷 ({capturedPhotos.length} / 4)
              </div>
              {canProceed && (
                <span className="badge badge-green">
                  <CheckCircle2 size={12} /> 선택 완료!
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[0, 1, 2, 3].map(i => {
                const photo = capturedPhotos[i];
                return (
                  <div key={i} style={{
                    aspectRatio: '4/3',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: photo ? '2px solid #818cf8' : '2px dashed rgba(255,255,255,0.18)',
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    {photo
                      ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>#{i + 1}</span>
                    }
                  </div>
                );
              })}
            </div>

            {!sessionDone && allPhotos.length === 0 && (
              <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                왼쪽 '촬영 시작' 버튼을 눌러주세요!
              </p>
            )}
          </div>

          {/* All taken photos gallery */}
          {allPhotos.length > 0 && (
            <div className="glass-panel" style={{ padding: '18px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-secondary)' }}>
                📷 촬영된 사진 갤러리 — 4장 클릭 선택
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {allPhotos.map((photo, idx) => {
                  const isSelected = capturedPhotos.includes(photo);
                  const selIdx = capturedPhotos.indexOf(photo);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleSelect(photo)}
                      style={{
                        position: 'relative',
                        aspectRatio: '4/3',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: isSelected ? '3px solid #ec4899' : '2px solid transparent',
                        boxShadow: isSelected ? '0 0 12px rgba(236,72,153,0.5)' : 'none',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {isSelected && (
                        <div style={{
                          position: 'absolute', top: '5px', right: '5px',
                          width: '22px', height: '22px', borderRadius: '50%',
                          background: '#ec4899', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: 800,
                        }}>
                          {selIdx + 1}
                        </div>
                      )}
                      <div style={{
                        position: 'absolute', bottom: '4px', left: '5px',
                        fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.7)',
                        background: 'rgba(0,0,0,0.4)', padding: '1px 5px', borderRadius: '4px',
                      }}>
                        #{idx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nav Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => { sound.playPop(); onPrev(); }}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '13px' }}
            >
              <ArrowLeft size={16} /> 프레임 선택
            </button>
            <button
              onClick={() => { sound.playPop(); onNext(); }}
              disabled={!canProceed}
              className="btn btn-primary"
              style={{ flex: 1.8, padding: '13px', opacity: canProceed ? 1 : 0.35, cursor: canProceed ? 'pointer' : 'not-allowed' }}
            >
              스티커 꾸미기 <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
