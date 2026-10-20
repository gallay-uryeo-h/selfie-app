// 웹캠이 없거나 시뮬레이션 모드일 때 사용할 고품질 샘플 사진 생성기
export function generateSamplePhoto(index) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  const themes = [
    { bg1: '#6366f1', bg2: '#a855f7', pose: '✌️', title: '브이 포즈!', desc: '공통영어 정복!' },
    { bg1: '#3b82f6', bg2: '#06b6d4', pose: '😎', title: '자신만만 컷', desc: '1등급 노리는 중' },
    { bg1: '#ec4899', bg2: '#f43f5e', pose: '🫰', title: '손하트 찰칵', desc: '영어 완전 꿀잼' },
    { bg1: '#10b981', bg2: '#059669', pose: '✨', title: '세특 아이디어', desc: '탐구보고서 작성 중' },
    { bg1: '#f59e0b', bg2: '#d97706', pose: '📚', title: '열공 모드', desc: '단어 마스터' },
    { bg1: '#8b5cf6', bg2: '#6366f1', pose: '🎓', title: '고교학점제 준비', desc: '내 적성 선택과목' },
  ];

  const theme = themes[index % themes.length];

  // 그라디언트 배경
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, theme.bg1);
  grad.addColorStop(1, theme.bg2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 미묘한 패턴 원
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 220, 0, Math.PI * 2);
  ctx.fill();

  // 중앙 캐릭터/이모지
  ctx.font = '110px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(theme.pose, canvas.width / 2, canvas.height / 2 - 35);

  // 텍스트 라벨
  ctx.font = 'bold 28px "Pretendard", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(theme.title, canvas.width / 2, canvas.height / 2 + 75);

  ctx.font = '500 18px "Pretendard", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText(theme.desc, canvas.width / 2, canvas.height / 2 + 115);

  // 컷 번호 워터마크
  ctx.font = 'bold 15px "Outfit", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.textAlign = 'right';
  ctx.fillText(`CUT #${index + 1}`, canvas.width - 25, 35);

  return canvas.toDataURL('image/jpeg', 0.92);
}
