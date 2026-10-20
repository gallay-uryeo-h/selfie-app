// 외부 등록 스티커 관리 및 로컬 저장소 유틸리티
const STORAGE_KEY = 'photobooth_custom_stickers';

// 기본 제공되는 외부 디자인 샘플 스티커 (테스트 및 즉시 체험용)
export const SAMPLE_EXTERNAL_STICKERS = [
  {
    id: 'ext_sample_bear_mascot',
    name: '스펙트럼 곰돌이 마스코트',
    category: 'deco',
    defaultWidth: 85,
    isExternal: true,
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90">
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="%23000000" flood-opacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(%23shadow)">
        <!-- 귀 -->
        <circle cx="22" cy="24" r="14" fill="%23b45309" stroke="%23ffffff" stroke-width="3"/>
        <circle cx="22" cy="24" r="7" fill="%23fde68a"/>
        <circle cx="68" cy="24" r="14" fill="%23b45309" stroke="%23ffffff" stroke-width="3"/>
        <circle cx="68" cy="24" r="7" fill="%23fde68a"/>
        <!-- 얼굴 -->
        <circle cx="45" cy="50" r="32" fill="%23d97706" stroke="%23ffffff" stroke-width="3.5"/>
        <!-- 눈 -->
        <circle cx="34" cy="46" r="4" fill="%231e293b"/>
        <circle cx="35" cy="45" r="1.5" fill="%23ffffff"/>
        <circle cx="56" cy="46" r="4" fill="%231e293b"/>
        <circle cx="57" cy="45" r="1.5" fill="%23ffffff"/>
        <!-- 주둥이 -->
        <ellipse cx="45" cy="58" rx="14" ry="10" fill="%23fef3c7"/>
        <ellipse cx="45" cy="54" rx="4.5" ry="3.5" fill="%2378350f"/>
        <path d="M 45 57.5 L 45 62 M 42 61 Q 45 64 48 61" stroke="%2378350f" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <!-- 볼터치 -->
        <circle cx="27" cy="56" r="4.5" fill="%23f43f5e" opacity="0.6"/>
        <circle cx="63" cy="56" r="4.5" fill="%23f43f5e" opacity="0.6"/>
      </g>
    </svg>`,
  },
  {
    id: 'ext_sample_school_crest',
    name: 'English Camp 엠블럼',
    category: 'career',
    defaultWidth: 95,
    isExternal: true,
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" flood-color="%23000000" flood-opacity="0.3"/>
        </filter>
        <linearGradient id="crestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%231e3a8a"/>
          <stop offset="100%" stop-color="%233b82f6"/>
        </linearGradient>
      </defs>
      <g filter="url(%23shadow)">
        <!-- 방패 방패 문장 -->
        <path d="M 50 8 L 88 22 C 88 56 68 84 50 94 C 32 84 12 56 12 22 Z" fill="url(%23crestGrad)" stroke="%23ffffff" stroke-width="3"/>
        <path d="M 50 14 L 82 25 C 82 52 65 77 50 86 C 35 77 18 52 18 25 Z" fill="none" stroke="%23fbbf24" stroke-width="1.8" stroke-dasharray="3,2"/>
        <text x="50" y="44" fill="%23fef08a" font-family="'Pretendard', sans-serif" font-weight="900" font-size="13" text-anchor="middle">ENGLISH</text>
        <text x="50" y="60" fill="%23ffffff" font-family="'Pretendard', sans-serif" font-weight="800" font-size="10" text-anchor="middle">CAMP 2026</text>
        <text x="50" y="74" fill="%2338bdf8" font-family="'Pretendard', sans-serif" font-weight="900" font-size="11" text-anchor="middle">★ PASS ★</text>
      </g>
    </svg>`,
  },
  {
    id: 'ext_sample_lucky_star',
    name: '행운의 네잎클로버',
    category: 'deco',
    defaultWidth: 75,
    isExternal: true,
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="85" viewBox="0 0 80 85">
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="%23000000" flood-opacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(%23shadow)">
        <!-- 줄기 -->
        <path d="M 40 45 Q 46 65 35 80" fill="none" stroke="%2315803d" stroke-width="3.5" stroke-linecap="round"/>
        <!-- 4개 잎 -->
        <path d="M 40 40 C 40 22 25 18 20 28 C 15 38 35 40 40 40 Z" fill="%2322c55e" stroke="%23ffffff" stroke-width="2"/>
        <path d="M 40 40 C 40 22 55 18 60 28 C 65 38 45 40 40 40 Z" fill="%2316a34a" stroke="%23ffffff" stroke-width="2"/>
        <path d="M 40 40 C 22 40 18 55 28 60 C 38 65 40 45 40 40 Z" fill="%2315803d" stroke="%23ffffff" stroke-width="2"/>
        <path d="M 40 40 C 58 40 62 55 52 60 C 42 65 40 45 40 40 Z" fill="%2322c55e" stroke="%23ffffff" stroke-width="2"/>
        <!-- 하이라이트 -->
        <circle cx="40" cy="40" r="3" fill="%23fef08a"/>
      </g>
    </svg>`,
  },
];

// 로컬 저장소에서 커스텀 스티커 불러오기
export function getCustomStickers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error('Failed to load custom stickers from localStorage:', err);
    return [];
  }
}

// 새 커스텀 스티커 저장
export function saveCustomSticker(sticker) {
  try {
    const current = getCustomStickers();
    const updated = [sticker, ...current.filter(s => s.id !== sticker.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save custom sticker:', err);
    throw err;
  }
}

// 커스텀 스티커 단건 삭제
export function deleteCustomSticker(stickerId) {
  try {
    const current = getCustomStickers();
    const updated = current.filter(s => s.id !== stickerId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete custom sticker:', err);
    return getCustomStickers();
  }
}

// 전체 커스텀 스티커 초기화
export function clearCustomStickers() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (err) {
    console.error('Failed to clear custom stickers:', err);
    return [];
  }
}

// 이미지 파일(PNG, SVG, WebP, JPG)을 안전한 크기의 Data URL로 변환 및 최적화
export function processStickerImageFile(file, options = { maxWidth: 360, maxHeight: 360, applyDieCutBorder: false }) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('파일이 지정되지 않았습니다.'));

    // SVG 파일인 경우 텍스트를 읽어 인라인 data-url로 처리
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    // 일반 이미지 파일(PNG, WebP, JPG)인 경우 캔버스 리사이즈 처리
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const { maxWidth = 360, maxHeight = 360, applyDieCutBorder = false } = options;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // 적정 크기로 비율 유지 축소
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const padding = applyDieCutBorder ? 12 : 0;
        const canvas = document.createElement('canvas');
        canvas.width = width + padding * 2;
        canvas.height = height + padding * 2;
        const ctx = canvas.getContext('2d');

        if (applyDieCutBorder) {
          // 화이트 다이컷 외곽선 효과를 위해 그림자 필터 적용
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 6;
          for (let i = 0; i < 4; i++) {
            ctx.drawImage(img, padding, padding, width, height);
          }
          ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetY = 2;
        }

        ctx.drawImage(img, padding, padding, width, height);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => reject(new Error('이미지를 로드할 수 없습니다.'));
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
