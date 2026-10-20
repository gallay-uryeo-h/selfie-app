import React, { useState, useRef } from 'react';
import { 
  X, Settings, ImagePlus, Sparkles, Trash2, Upload, Check, 
  Palette, Sliders, Info, PlusCircle, RefreshCw, Layers, FileImage, Sun, Moon
} from 'lucide-react';
import { 
  processStickerImageFile, saveCustomSticker, deleteCustomSticker, 
  clearCustomStickers, SAMPLE_EXTERNAL_STICKERS 
} from '../utils/customStickers';
import { STICKER_CATEGORIES } from '../constants/stickers';
import { sound } from '../utils/soundEffects';

const GRADIENT_PRESETS = [
  { id: 'blue', label: '스카이 블루', start: '#2563eb', end: '#38bdf8' },
  { id: 'indigo', label: '로열 인디고', start: '#4f46e5', end: '#818cf8' },
  { id: 'pink', label: '비비드 핑크', start: '#ec4899', end: '#f43f5e' },
  { id: 'emerald', label: '에메랄드 그린', start: '#059669', end: '#34d399' },
  { id: 'amber', label: '앰버 골드', start: '#d97706', end: '#fbbf24' },
  { id: 'purple', label: '네온 바이올렛', start: '#7c3aed', end: '#c084fc' },
  { id: 'dark', label: '다크 슬레이트', start: '#1e293b', end: '#475569' },
];

export default function SettingsModal({
  isOpen,
  onClose,
  customStickers,
  setCustomStickers,
  appSettings,
  setAppSettings,
}) {
  const [activeTab, setActiveTab] = useState('sticker_design'); // 'sticker_design' | 'general'
  const [designSubTab, setDesignSubTab] = useState('upload'); // 'upload' | 'create_text' | 'manage'

  // 외부 스티커 업로드 폼 상태
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [stickerName, setStickerName] = useState('');
  const [stickerCategory, setStickerCategory] = useState('deco');
  const [stickerDefaultWidth, setStickerDefaultWidth] = useState(90);
  const [applyDieCutBorder, setApplyDieCutBorder] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // 텍스트 다이컷 디자인 폼 상태
  const [customText, setCustomText] = useState('');
  const [customEmoji, setCustomEmoji] = useState('✨');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0]);
  const [customCategory, setCustomCategory] = useState('subject');

  if (!isOpen) return null;

  // 외부 이미지 파일 선택 처리
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const dataUrl = await processStickerImageFile(file, {
        maxWidth: 360,
        maxHeight: 360,
        applyDieCutBorder,
      });
      setUploadedImagePreview(dataUrl);
      if (!stickerName) {
        const defaultName = file.name.replace(/\.[^/.]+$/, '');
        setStickerName(defaultName);
      }
      sound.playPop();
    } catch (err) {
      alert('이미지를 불러오는데 실패했습니다: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 외부 스티커 등록 완료
  const handleRegisterUploadedSticker = (e) => {
    e.preventDefault();
    if (!uploadedImagePreview) {
      alert('등록할 스티커 이미지(PNG, SVG 등)를 먼저 선택해주세요!');
      return;
    }
    if (!stickerName.trim()) {
      alert('스티커 이름을 입력해주세요.');
      return;
    }

    const newSticker = {
      id: 'ext_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: stickerName.trim(),
      category: stickerCategory,
      src: uploadedImagePreview,
      defaultWidth: Number(stickerDefaultWidth) || 90,
      isExternal: true,
      createdAt: new Date().toISOString(),
    };

    const updated = saveCustomSticker(newSticker);
    setCustomStickers(updated);
    sound.playSuccess();

    // 초기화 및 완료 안내
    setUploadedImagePreview(null);
    setStickerName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    alert(`🎉 '${newSticker.name}' 스티커가 성공적으로 등록되었습니다!\n스티커 꾸미기 화면에서 바로 사용하실 수 있습니다.`);
  };

  // 샘플 외부 스티커 불러오기
  const handleLoadSampleStickers = () => {
    sound.playSuccess();
    let updated = [...customStickers];
    for (const sample of SAMPLE_EXTERNAL_STICKERS) {
      if (!updated.some(s => s.id === sample.id)) {
        updated = [sample, ...updated];
        saveCustomSticker(sample);
      }
    }
    setCustomStickers(updated);
    alert('✨ 샘플 외부 스티커 3종(곰돌이 마스코트, 엠블럼, 클로버)이 등록되었습니다!');
  };

  // 다이컷 텍스트 스티커 직접 디자인 및 등록
  const handleCreateTextSticker = (e) => {
    e.preventDefault();
    if (!customText.trim()) {
      alert('스티커에 들어갈 문구를 입력해주세요.');
      return;
    }

    const encText = encodeURIComponent(customText.trim());
    const encEmoji = customEmoji ? `${customEmoji} ` : '';
    const gStart = encodeURIComponent(selectedGradient.start);
    const gEnd = encodeURIComponent(selectedGradient.end);

    const svg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="130" height="38" viewBox="0 0 130 38">
      <defs>
        <filter id="nukki" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="%23000000" flood-opacity="0.3"/>
        </filter>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${gStart}"/>
          <stop offset="100%" stop-color="${gEnd}"/>
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="124" height="32" rx="16" fill="url(%23grad)" stroke="%23ffffff" stroke-width="2.5" filter="url(%23nukki)"/>
      <text x="65" y="20" fill="%23ffffff" font-family="'Pretendard', sans-serif" font-weight="900" font-size="12" text-anchor="middle" dominant-baseline="central">
        ${encEmoji}${encText}
      </text>
    </svg>`;

    const newSticker = {
      id: 'custom_txt_' + Date.now(),
      name: customText.trim(),
      category: customCategory,
      src: svg,
      defaultWidth: 95,
      isExternal: true,
      createdAt: new Date().toISOString(),
    };

    const updated = saveCustomSticker(newSticker);
    setCustomStickers(updated);
    sound.playSuccess();
    setCustomText('');
    alert(`🎨 '${newSticker.name}' 누끼 타이포 스티커가 제작 및 등록되었습니다!`);
  };

  // 스티커 단건 삭제
  const handleDeleteSticker = (id, name) => {
    if (confirm(`'${name}' 스티커를 정말 삭제하시겠습니까?`)) {
      sound.playPop();
      const updated = deleteCustomSticker(id);
      setCustomStickers(updated);
    }
  };

  // 등록된 외부 스티커 전체 삭제
  const handleClearAllCustomStickers = () => {
    if (confirm('등록된 모든 외부 스티커를 초기화하시겠습니까?')) {
      sound.playPop();
      const updated = clearCustomStickers();
      setCustomStickers(updated);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 15, 0.82)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Settings size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0 }}>
                포토부스 환경 설정
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                스티커 디자인 등록 및 촬영 옵션 관리
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(128, 128, 128, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="닫기"
          >
            <X size={18} />
          </button>
        </div>

        {/* Top Navigation Tabs */}
        <div style={{
          display: 'flex',
          padding: '12px 24px 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.2)',
        }}>
          <button
            onClick={() => setActiveTab('sticker_design')}
            style={{
              padding: '10px 18px',
              borderBottom: activeTab === 'sticker_design' ? '3px solid #ec4899' : '3px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              color: activeTab === 'sticker_design' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <Palette size={16} color={activeTab === 'sticker_design' ? '#ec4899' : 'currentColor'} />
            <span>스티커 디자인 & 외부 등록</span>
            {customStickers.length > 0 && (
              <span style={{
                background: '#ec4899',
                color: '#fff',
                fontSize: '11px',
                borderRadius: '10px',
                padding: '1px 7px',
                fontWeight: 800,
              }}>
                {customStickers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('general')}
            style={{
              padding: '10px 18px',
              borderBottom: activeTab === 'general' ? '3px solid #6366f1' : '3px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              color: activeTab === 'general' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <Sliders size={16} color={activeTab === 'general' ? '#6366f1' : 'currentColor'} />
            <span>촬영 & 타이머 설정</span>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          
          {/* TAB 1: 스티커 디자인 & 외부 등록 */}
          {activeTab === 'sticker_design' && (
            <div>
              {/* Sub-navigation buttons */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setDesignSubTab('upload')}
                  className={designSubTab === 'upload' ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '10px' }}
                >
                  <Upload size={14} />
                  <span>외부 스티커 이미지 업로드 (PNG/SVG)</span>
                </button>
                <button
                  onClick={() => setDesignSubTab('create_text')}
                  className={designSubTab === 'create_text' ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '10px' }}
                >
                  <Sparkles size={14} />
                  <span>직접 다이컷 타이포 디자인</span>
                </button>
                <button
                  onClick={() => setDesignSubTab('manage')}
                  className={designSubTab === 'manage' ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '10px' }}
                >
                  <Layers size={14} />
                  <span>등록된 스티커 관리 ({customStickers.length})</span>
                </button>
              </div>

              {/* Sub-tab A: 외부 이미지 파일 업로드 */}
              {designSubTab === 'upload' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: '14px',
                    background: 'rgba(99, 102, 241, 0.12)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    fontSize: '13px',
                    color: '#c7d2fe',
                    lineHeight: 1.5,
                  }}>
                    💡 <strong>누끼 스티커 업로드 안내</strong>: 포토샵, 일러스트레이터, Canva 등에서 배경을 투명하게 저장한 <strong>투명 PNG 또는 SVG 파일</strong>을 업로드하시면 사진 위에 자연스러운 누끼 스티커로 합성됩니다.
                  </div>

                  {/* Dropzone & Preview */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }}>
                    <form onSubmit={handleRegisterUploadedSticker} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                          1. 스티커 이미지 파일 선택 (PNG, SVG, WebP)
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/svg+xml,image/webp,image/jpeg"
                          onChange={handleFileChange}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '10px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px dashed rgba(255, 255, 255, 0.2)',
                            color: '#fff',
                            fontSize: '13px',
                            cursor: 'pointer',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                          2. 스티커 이름
                        </label>
                        <input
                          type="text"
                          value={stickerName}
                          onChange={(e) => setStickerName(e.target.value)}
                          placeholder="예: 2026 캠프 로고 / 토끼 머리띠"
                          maxLength={20}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            fontSize: '13px',
                            outline: 'none',
                          }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                            3. 카테고리 분류
                          </label>
                          <select
                            value={stickerCategory}
                            onChange={(e) => setStickerCategory(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '10px',
                              background: '#1e293b',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              color: '#fff',
                              fontSize: '13px',
                              outline: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="deco">포토 소품/데코 🎀</option>
                            <option value="subject">선택과목 📚</option>
                            <option value="eval">평가/목표 🎯</option>
                            <option value="career">세특/진로 🔬</option>
                            <option value="wit">말풍선/위트 💬</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                            4. 기본 크기 (너비)
                          </label>
                          <select
                            value={stickerDefaultWidth}
                            onChange={(e) => setStickerDefaultWidth(Number(e.target.value))}
                            style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '10px',
                              background: '#1e293b',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              color: '#fff',
                              fontSize: '13px',
                              outline: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <option value={75}>작은 크기 (75px) - 볼터치/별</option>
                            <option value={90}>보통 크기 (90px) - 안경/왕관</option>
                            <option value={110}>큰 크기 (110px) - 머리띠/배지</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <input
                          type="checkbox"
                          id="borderOpt"
                          checked={applyDieCutBorder}
                          onChange={(e) => setApplyDieCutBorder(e.target.checked)}
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                        <label htmlFor="borderOpt" style={{ fontSize: '13px', color: '#cbd5e1', cursor: 'pointer' }}>
                          화이트 다이컷 테두리 & 입체 그림자 효과 자동 적용
                        </label>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button
                          type="submit"
                          disabled={!uploadedImagePreview || isProcessing}
                          className="btn btn-primary"
                          style={{
                            flex: 1,
                            padding: '12px',
                            fontSize: '14px',
                            opacity: (!uploadedImagePreview || isProcessing) ? 0.5 : 1,
                          }}
                        >
                          <PlusCircle size={16} />
                          <span>외부 스티커 등록 완료</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleLoadSampleStickers}
                          className="btn btn-secondary"
                          style={{ padding: '12px 14px', fontSize: '12px' }}
                          title="테스트용 샘플 외부 스티커 3종 자동 등록"
                        >
                          <span>샘플 불러오기</span>
                        </button>
                      </div>
                    </form>

                    {/* Preview Area */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '16px',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '20px',
                      textAlign: 'center',
                      minHeight: '220px',
                    }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 600 }}>
                        {uploadedImagePreview ? '✨ 업로드된 스티커 미리보기' : '📷 이미지 미리보기'}
                      </div>
                      
                      {uploadedImagePreview ? (
                        <div style={{
                          padding: '16px',
                          borderRadius: '12px',
                          background: 'repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%) 50% / 16px 16px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          maxWidth: '180px',
                          maxHeight: '180px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <img
                            src={uploadedImagePreview}
                            alt="미리보기"
                            style={{ maxWidth: '100%', maxHeight: '140px', objectFit: 'contain' }}
                          />
                        </div>
                      ) : (
                        <div style={{ color: 'rgba(255, 255, 255, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <FileImage size={48} strokeWidth={1.5} />
                          <span style={{ fontSize: '12px' }}>파일을 선택하면 이곳에 미리보기가 나타납니다</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab B: 직접 다이컷 타이포 디자인 */}
              {designSubTab === 'create_text' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <form onSubmit={handleCreateTextSticker} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                          스티커 문구 입력
                        </label>
                        <input
                          type="text"
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          placeholder="예: 2026 수능완벽대비 / 영어영문학도"
                          maxLength={16}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            fontSize: '13px',
                            outline: 'none',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                          이모지 아이콘
                        </label>
                        <input
                          type="text"
                          value={customEmoji}
                          onChange={(e) => setCustomEmoji(e.target.value)}
                          placeholder="✨"
                          maxLength={3}
                          style={{
                            width: '100%',
                            padding: '10px',
                            textAlign: 'center',
                            borderRadius: '10px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            fontSize: '16px',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>

                    {/* Gradient color themes */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                        그라데이션 색상 테마 선택
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        {GRADIENT_PRESETS.map((grad) => {
                          const isSelected = selectedGradient.id === grad.id;
                          return (
                            <button
                              type="button"
                              key={grad.id}
                              onClick={() => setSelectedGradient(grad)}
                              style={{
                                padding: '8px 10px',
                                borderRadius: '10px',
                                background: `linear-gradient(135deg, ${grad.start} 0%, ${grad.end} 100%)`,
                                border: isSelected ? '2px solid #ffffff' : '2px solid transparent',
                                color: '#ffffff',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                boxShadow: isSelected ? '0 0 10px rgba(255,255,255,0.4)' : 'none',
                              }}
                            >
                              {isSelected && <Check size={12} />}
                              <span>{grad.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                        카테고리 분류
                      </label>
                      <select
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '10px',
                          background: '#1e293b',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#fff',
                          fontSize: '13px',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="subject">선택과목 📚</option>
                        <option value="eval">평가/목표 🎯</option>
                        <option value="career">세특/진로 🔬</option>
                        <option value="wit">말풍선/위트 💬</option>
                        <option value="deco">포토 소품/데코 🎀</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={!customText.trim()}
                      className="btn btn-primary"
                      style={{ padding: '12px', fontSize: '14px', marginTop: '6px', opacity: !customText.trim() ? 0.5 : 1 }}
                    >
                      <PlusCircle size={16} />
                      <span>다이컷 타이포 스티커 생성 및 등록</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Sub-tab C: 등록된 커스텀 스티커 관리 */}
              {designSubTab === 'manage' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      총 <strong>{customStickers.length}</strong>개의 스티커가 등록되어 있습니다.
                    </span>
                    {customStickers.length > 0 && (
                      <button
                        onClick={handleClearAllCustomStickers}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '11px', color: '#ef4444' }}
                      >
                        <Trash2 size={12} />
                        <span>전체 초기화</span>
                      </button>
                    )}
                  </div>

                  {customStickers.length === 0 ? (
                    <div style={{
                      padding: '40px 20px',
                      textAlign: 'center',
                      borderRadius: '16px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px dashed rgba(255, 255, 255, 0.15)',
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎨</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                        등록된 외부 스티커가 없습니다.
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        학교 로고, 동아리 캐릭터, 투명 PNG 스티커를 직접 등록해보세요!
                      </p>
                      <button
                        onClick={handleLoadSampleStickers}
                        className="btn btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '12px' }}
                      >
                        <span>샘플 스티커 3종 불러오기</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '12px',
                      maxHeight: '340px',
                      overflowY: 'auto',
                    }}>
                      {customStickers.map((stk) => (
                        <div
                          key={stk.id}
                          style={{
                            padding: '12px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative',
                          }}
                        >
                          <button
                            onClick={() => handleDeleteSticker(stk.id, stk.name)}
                            title="스티커 삭제"
                            style={{
                              position: 'absolute',
                              top: '6px',
                              right: '6px',
                              background: 'rgba(239, 68, 68, 0.2)',
                              border: '1px solid #ef4444',
                              color: '#fca5a5',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={11} />
                          </button>
                          
                          <div style={{ height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={stk.src} alt={stk.name} style={{ maxHeight: '46px', maxWidth: '85px', objectFit: 'contain' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700, marginTop: '8px', textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {stk.name}
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                            {STICKER_CATEGORIES.find(c => c.id === stk.category)?.label.split(' ')[0] || '사용자'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 화면 테마 & 키오스크 설정 */}
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Theme Mode Switcher */}
              <div style={{
                padding: '16px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🎨</span>
                    <span>화면 테마 모드 전환</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    화사하고 밝은 라이트 모드 또는 집중도 높은 다크 모드로 변경합니다.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setAppSettings(prev => ({ ...prev, theme: 'dark' }));
                    }}
                    className={appSettings.theme !== 'light' ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ padding: '8px 16px', fontSize: '13px', gap: '6px' }}
                  >
                    <Moon size={14} />
                    <span>다크 모드</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setAppSettings(prev => ({ ...prev, theme: 'light' }));
                    }}
                    className={appSettings.theme === 'light' ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ padding: '8px 16px', fontSize: '13px', gap: '6px' }}
                  >
                    <Sun size={14} />
                    <span>라이트 모드</span>
                  </button>
                </div>
              </div>

              {/* Countdown duration */}
              <div style={{
                padding: '16px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                  ⏱️ 컷당 촬영 카운트다운 시간
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  촬영 버튼을 누른 후 사진이 찍힐 때까지의 카운트다운 타이머 초를 설정합니다.
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[3, 5, 10].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setAppSettings(prev => ({ ...prev, countdownSeconds: sec }))}
                      className={appSettings.countdownSeconds === sec ? 'btn btn-primary' : 'btn btn-secondary'}
                      style={{ padding: '8px 18px', fontSize: '13px' }}
                    >
                      {sec}초 {sec === 3 ? '(기본값)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sticker limit time */}
              <div style={{
                padding: '16px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                  ⏰ 스티커 꾸미기 제한시간
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  키오스크 대기열 관리를 위한 스티커 꾸미기 제한시간을 조정합니다.
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { label: '60초', val: 60 },
                    { label: '90초 (기본)', val: 90 },
                    { label: '120초', val: 120 },
                    { label: '무제한', val: 0 },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setAppSettings(prev => ({ ...prev, stickerTimeLimit: opt.val }))}
                      className={appSettings.stickerTimeLimit === opt.val ? 'btn btn-primary' : 'btn btn-secondary'}
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound effect toggle */}
              <div style={{
                padding: '16px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>
                    🔊 효과음 사운드 (Web Audio API)
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    카운트다운, 셔터음, 팝 사운드 재생 여부
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = !appSettings.soundEnabled;
                    setAppSettings(prev => ({ ...prev, soundEnabled: next }));
                    sound.setMuted(!next);
                  }}
                  className={appSettings.soundEnabled ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  {appSettings.soundEnabled ? '켜짐 (ON)' : '음소거 (OFF)'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'rgba(255, 255, 255, 0.02)',
        }}>
          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ padding: '10px 24px', fontSize: '14px' }}
          >
            <span>확인 및 닫기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
