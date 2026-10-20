// 앱 아이콘 PNG 생성 스크립트 (Node.js Canvas 없이 SVG→HTML Canvas 방식으로 public/icons 생성)
// public/icons 폴더에 간단한 SVG 아이콘 파일을 직접 생성합니다

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const dir = join(process.cwd(), 'public', 'icons');
try { mkdirSync(dir, { recursive: true }); } catch {}

// 192x192 SVG
const svg192 = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <rect width="192" height="192" rx="42" fill="url(#g)"/>
  <text x="96" y="115" font-size="88" text-anchor="middle" dominant-baseline="central">📸</text>
</svg>`;

const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#g)"/>
  <text x="256" y="290" font-size="240" text-anchor="middle" dominant-baseline="central">📸</text>
</svg>`;

writeFileSync(join(dir, 'icon-192.svg'), svg192);
writeFileSync(join(dir, 'icon-512.svg'), svg512);
// PNG 대신 SVG를 사용 (브라우저 지원)
writeFileSync(join(dir, 'icon-192.png'), svg192); // fallback as svg content
writeFileSync(join(dir, 'icon-512.png'), svg512);
console.log('Icons generated in public/icons/');
