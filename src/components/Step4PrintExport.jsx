import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { Printer, Download, QrCode, RotateCcw, Sparkles, CheckCircle2, Share2, ArrowLeft } from 'lucide-react';
import { sound } from '../utils/soundEffects';

const HR_WIDTH = 1200;
const HR_HEIGHT = 1800;

export default function Step4PrintExport({ capturedPhotos, selectedTheme, selectedColor, selectedLayout, stickers, onReset }) {
  const [renderedUrl, setRenderedUrl] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [isRendering, setIsRendering] = useState(true);
  const [renderProgress, setRenderProgress] = useState('고해상도 합성 준비 중...');
  const [printReady, setPrintReady] = useState(false);

  // ── Launch celebration ───────────────────────────────────
  useEffect(() => {
    sound.playSuccess();

    const fire = (particleRatio, opts) => {
      confetti({
        origin: { y: 0.7 },
        particleCount: Math.floor(150 * particleRatio),
        ...opts,
      });
    };

    setTimeout(() => {
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }, 300);
  }, []);

  // ── QR code generation ───────────────────────────────────
  useEffect(() => {
    const url = `${window.location.origin}?download=${Date.now()}`;
    QRCode.toDataURL(url, {
      margin: 1,
      width: 160,
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then(setQrUrl)
      .catch(err => console.error('QR failed:', err));
  }, []);

  // ── High-res composite render ────────────────────────────
  useEffect(() => {
    if (!qrUrl) return;

    const render = async () => {
      setIsRendering(true);

      const canvas = document.createElement('canvas');
      canvas.width = HR_WIDTH;
      canvas.height = HR_HEIGHT;
      const ctx = canvas.getContext('2d');

      // 1. Background
      setRenderProgress('배경 채우는 중...');
      ctx.fillStyle = selectedColor.value;
      ctx.fillRect(0, 0, HR_WIDTH, HR_HEIGHT);

      // Outer border
      ctx.strokeStyle = selectedColor.border || 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 18;
      ctx.strokeRect(14, 14, HR_WIDTH - 28, HR_HEIGHT - 28);

      // 2. Header text
      setRenderProgress('헤더 텍스트 그리는 중...');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = selectedColor.text;
      ctx.font = `900 52px "Outfit", "Pretendard", sans-serif`;
      ctx.fillText(selectedTheme.headerText, HR_WIDTH / 2, 105);

      // Gradient accent line under header
      const lineGrad = ctx.createLinearGradient(80, 0, HR_WIDTH - 80, 0);
      lineGrad.addColorStop(0, 'transparent');
      lineGrad.addColorStop(0.3, selectedColor.text);
      lineGrad.addColorStop(0.7, selectedColor.text);
      lineGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = lineGrad;
      ctx.fillRect(80, 120, HR_WIDTH - 160, 3);

      // 3. Photos
      setRenderProgress('사진 합성 중...');
      const marginX = 70;
      const startY = 160;
      const gap = 22;
      const photoImgs = await Promise.all(
        capturedPhotos.map(src => new Promise(res => {
          const img = new Image();
          img.onload = () => res(img);
          img.onerror = () => res(null);
          img.src = src;
        }))
      );

      if (selectedLayout.id === 'grid_2x2') {
        const pw = (HR_WIDTH - marginX * 2 - gap) / 2;
        const ph = pw * 0.75;
        const positions = [
          { x: marginX, y: startY },
          { x: marginX + pw + gap, y: startY },
          { x: marginX, y: startY + ph + gap },
          { x: marginX + pw + gap, y: startY + ph + gap },
        ];
        photoImgs.forEach((img, i) => {
          if (!img || !positions[i]) return;
          const { x, y } = positions[i];
          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.25)';
          ctx.shadowBlur = 20;
          // Rounded clip
          ctx.beginPath();
          ctx.roundRect(x, y, pw, ph, 10);
          ctx.clip();
          ctx.drawImage(img, x, y, pw, ph);
          ctx.restore();
        });
      } else {
        const sw = HR_WIDTH - marginX * 2;
        const sh = (HR_HEIGHT - 450) / 4 - gap;
        photoImgs.forEach((img, i) => {
          if (!img) return;
          const y = startY + i * (sh + gap);
          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 14;
          ctx.beginPath(); ctx.roundRect(marginX, y, sw, sh, 8); ctx.clip();
          ctx.drawImage(img, marginX, y, sw, sh);
          ctx.restore();
        });
      }

      // 4. Stickers
      setRenderProgress('스티커 합성 중...');
      const scaleX = HR_WIDTH / 360;
      const scaleY = HR_HEIGHT / 520;

      for (const s of stickers) {
        await new Promise(resolve => {
          const img = new Image();
          img.onload = () => {
            ctx.save();
            ctx.translate(s.x * scaleX, s.y * scaleY);
            ctx.rotate((s.rotation * Math.PI) / 180);
            ctx.scale(s.scale * scaleX, s.scale * scaleY);
            const w = s.width;
            const h = img.naturalHeight > 0 ? (img.naturalHeight / img.naturalWidth) * w : w * 0.3;
            ctx.drawImage(img, -w / 2, -h / 2, w, h);
            ctx.restore();
            resolve();
          };
          img.onerror = resolve;
          img.src = s.src;
        });
      }

      // 5. Footer
      setRenderProgress('푸터 및 QR 삽입 중...');
      const footerY = HR_HEIGHT - 185;

      // Separator
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(70, footerY - 18, HR_WIDTH - 140, 1);

      ctx.textAlign = 'left';
      ctx.fillStyle = selectedColor.text;
      ctx.font = `bold 30px "Pretendard", sans-serif`;
      ctx.fillText(selectedTheme.footerText, 80, footerY + 35);

      ctx.font = `600 20px "Pretendard", sans-serif`;
      ctx.fillStyle = selectedColor.text;
      ctx.globalAlpha = 0.65;
      ctx.fillText('Find Your English Spectrum! 📸', 80, footerY + 75);
      const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.fillText(today, 80, footerY + 110);
      ctx.globalAlpha = 1;

      // QR Code
      if (qrUrl) {
        const qrImg = new Image();
        await new Promise(res => { qrImg.onload = res; qrImg.src = qrUrl; });
        const qrSize = 140;
        const qrX = HR_WIDTH - 80 - qrSize;
        const qrY = footerY + 10;
        // White background for QR
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.roundRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 8); ctx.fill();
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        ctx.fillStyle = selectedColor.text;
        ctx.font = 'bold 16px "Pretendard", sans-serif';
        ctx.textAlign = 'center';
        ctx.globalAlpha = 0.7;
        ctx.fillText('📱 스마트폰으로 스캔', qrX + qrSize / 2, qrY + qrSize + 24);
        ctx.globalAlpha = 1;
      }

      const finalUrl = canvas.toDataURL('image/png', 1.0);
      setRenderedUrl(finalUrl);
      setIsRendering(false);
      setPrintReady(true);
      setRenderProgress('완료!');
    };

    render().catch(err => {
      console.error('Render failed:', err);
      setIsRendering(false);
      setRenderProgress('렌더링 중 오류가 발생했습니다.');
    });
  }, [qrUrl, capturedPhotos, selectedTheme, selectedColor, selectedLayout, stickers]);

  const handlePrint = () => {
    sound.playPop();
    window.print();
  };

  const handleDownload = () => {
    if (!renderedUrl) return;
    sound.playPop();
    const a = document.createElement('a');
    a.href = renderedUrl;
    a.download = `EnglishSpectrum_${Date.now()}.png`;
    a.click();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '10px 24px 50px' }}>

      {/* Print-only area */}
      <div className="print-area" style={{ display: 'none' }}>
        {renderedUrl && <img src={renderedUrl} alt="print" />}
      </div>

      {/* Screen UI */}
      <div className="no-print">
        {/* Celebration header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="badge badge-green" style={{ marginBottom: '14px', padding: '7px 20px', fontSize: '14px', gap: '7px' }}>
            <CheckCircle2 size={16} /> 나만의 영어과 네컷사진 완성! 🎉
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '8px', lineHeight: 1.2 }}>
            사진을 인쇄하거나<br />스마트폰에 저장해보세요
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            QR 코드를 스캔하거나 고화질 PNG 파일로 다운로드할 수 있습니다.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '32px', alignItems: 'start' }}>

          {/* Preview Card */}
          <div className="glass-panel" style={{ padding: '22px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '14px' }}>
              인쇄 미리보기 — 300 DPI 4×6인치 규격
            </div>

            {isRendering ? (
              <div style={{ height: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px' }}>
                <div className="spinner" style={{ width: '48px', height: '48px', borderWidth: '4px' }} />
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#818cf8' }}>{renderProgress}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>잠시만 기다려주세요...</div>
              </div>
            ) : (
              <div style={{
                borderRadius: '12px', overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <img src={renderedUrl} alt="Final photo" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            )}
          </div>

          {/* Action Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Print */}
            <div className="glass-panel" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Printer size={26} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>포토 프린터로 인쇄</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Canon SELPHY CP1500 등 무선/USB 포토 프린터로<br />4×6 인화지에 고화질 인쇄합니다.
                  </p>
                </div>
              </div>
              <button
                onClick={handlePrint}
                disabled={!printReady}
                className="btn btn-primary btn-lg pulse-glow"
                style={{ width: '100%' }}
              >
                <Printer size={20} />
                지금 인쇄하기 🖨️
              </button>
            </div>

            {/* QR & Download */}
            <div className="glass-panel" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, #ec4899, #f43f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <QrCode size={26} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>스마트폰 QR 저장</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    QR 코드를 스캔하거나 PNG 파일을 직접 다운로드하세요.
                  </p>
                </div>
                {qrUrl && (
                  <div style={{ padding: '6px', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,0.3)', flexShrink: 0 }}>
                    <img src={qrUrl} alt="QR" style={{ width: '80px', height: '80px', display: 'block' }} />
                  </div>
                )}
              </div>
              <button
                onClick={handleDownload}
                disabled={!printReady}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '13px', gap: '8px' }}
              >
                <Download size={18} />
                고화질 PNG 다운로드 (무료 소장)
              </button>
            </div>

            {/* Stats summary */}
            <div className="glass-panel-subtle" style={{ padding: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                {[
                  { label: '선택한 사진', value: `${capturedPhotos.length}컷` },
                  { label: '부착한 스티커', value: `${stickers.length}개` },
                  { label: '인화 규격', value: '4×6인치' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '22px', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#818cf8' }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                onClick={() => { sound.playPop(); onReset(); }}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '14px' }}
              >
                <RotateCcw size={17} /> 새로 시작하기
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
