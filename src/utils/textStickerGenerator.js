// 텍스트 누끼(다이컷 외곽선만 있고 배경 박스 없는 형태) 스티커 생성 유틸리티

/**
 * SVG 기반 텍스트 누끼 스티커 생성
 * - 배경 박스(<rect>, <path> 등)가 전혀 없음
 * - 글자 자체에 화이트 다이컷 외곽선(paint-order: stroke fill)과 드롭 섀도우만 적용
 * - 글자 주변 및 글자 사이는 100% 완전 투명(누끼)
 */
export function createTextNukkiSvg({
  text,
  emoji = '',
  gradientStart = '#2563eb',
  gradientEnd = '#38bdf8',
  strokeWidth = 9,
  fontSize = 24,
  fontFamily = "'Black Han Sans', 'Pretendard', 'Outfit', sans-serif",
}) {
  const fullText = emoji ? `${emoji} ${text}` : text;
  const encText = encodeURIComponent(fullText);
  const gStart = encodeURIComponent(gradientStart);
  const gEnd = encodeURIComponent(gradientEnd);

  // 글자 수 기반 너비 계산 (한글/기호 1.05em, 이모지 1.2em, 영문/숫자 0.62em)
  let charUnits = 0;
  for (const ch of fullText) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      charUnits += 1.05;
    } else if (code > 0x2000) {
      charUnits += 1.25;
    } else {
      charUnits += 0.64;
    }
  }

  const width = Math.ceil(charUnits * fontSize + strokeWidth * 2 + 18);
  const height = Math.ceil(fontSize * 1.5 + strokeWidth * 2 + 10);

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <filter id="nukkiShadow" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="%23000000" flood-opacity="0.38"/>
      </filter>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${gStart}"/>
        <stop offset="100%" stop-color="${gEnd}"/>
      </linearGradient>
    </defs>
    <!-- 오직 텍스트 자체와 화이트 다이컷 외곽선만 렌더링 (배경 박스/사각형 일체 없음) -->
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="central"
          font-family="${fontFamily}"
          font-weight="900" font-size="${fontSize}"
          stroke="%23ffffff" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round"
          paint-order="stroke fill"
          fill="url(%23textGrad)"
          filter="url(%23nukkiShadow)">
      ${encText}
    </text>
  </svg>`;
}

/**
 * Canvas 2D 기반 텍스트 누끼 PNG 스티커 생성
 * - 브라우저 캔버스로 글자 픽셀을 정밀 측정하여 오직 글자와 외곽선만 PNG로 변환
 */
export function renderTextNukkiPng({
  text,
  emoji = '',
  gradientStart = '#ec4899',
  gradientEnd = '#8b5cf6',
  strokeWidth = 10,
  fontSize = 32,
  fontFamily = "'Black Han Sans', 'Pretendard', sans-serif",
}) {
  const fullText = emoji ? `${emoji} ${text}` : text;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  ctx.font = `900 ${fontSize}px ${fontFamily}`;
  const metrics = ctx.measureText(fullText);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(fontSize * 1.3);
  
  const padding = strokeWidth * 2 + 12;
  canvas.width = textWidth + padding * 2;
  canvas.height = textHeight + padding * 2;
  
  const drawCtx = canvas.getContext('2d');
  drawCtx.font = `900 ${fontSize}px ${fontFamily}`;
  drawCtx.textAlign = 'center';
  drawCtx.textBaseline = 'middle';
  
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  
  // 1. 외곽 그림자
  drawCtx.save();
  drawCtx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  drawCtx.shadowBlur = 6;
  drawCtx.shadowOffsetY = 3;
  drawCtx.strokeStyle = '#ffffff';
  drawCtx.lineWidth = strokeWidth * 2;
  drawCtx.lineJoin = 'round';
  drawCtx.lineCap = 'round';
  drawCtx.strokeText(fullText, cx, cy);
  drawCtx.restore();
  
  // 2. 도톰한 화이트 다이컷 외곽선 (글자 윤곽 따라 생성)
  drawCtx.strokeStyle = '#ffffff';
  drawCtx.lineWidth = strokeWidth * 2;
  drawCtx.lineJoin = 'round';
  drawCtx.lineCap = 'round';
  drawCtx.strokeText(fullText, cx, cy);
  
  // 3. 그라데이션 글자 채우기
  const grad = drawCtx.createLinearGradient(cx - textWidth / 2, 0, cx + textWidth / 2, 0);
  grad.addColorStop(0, gradientStart);
  grad.addColorStop(1, gradientEnd);
  drawCtx.fillStyle = grad;
  drawCtx.fillText(fullText, cx, cy);
  
  return {
    src: canvas.toDataURL('image/png'),
    width: Math.round(canvas.width * 0.45),
  };
}
