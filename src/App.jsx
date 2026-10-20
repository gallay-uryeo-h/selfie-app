import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import LandingScreen from './components/LandingScreen';
import Step1FrameSelect from './components/Step1FrameSelect';
import Step2CameraCapture from './components/Step2CameraCapture';
import Step3StickerEditor from './components/Step3StickerEditor';
import Step4PrintExport from './components/Step4PrintExport';
import './App.css';

import { FRAME_THEMES, FRAME_COLORS, FRAME_LAYOUTS } from './constants/frames';
import { sound } from './utils/soundEffects';

export default function App() {
  // step 0 = landing, 1–4 = photobooth steps
  const [currentStep, setCurrentStep] = useState(0);
  const [soundMuted, setSoundMuted] = useState(false);

  // Step 1 selections
  const [selectedTheme, setSelectedTheme] = useState(FRAME_THEMES[0]);
  const [selectedColor, setSelectedColor] = useState(FRAME_COLORS[0]);
  const [selectedLayout, setSelectedLayout] = useState(FRAME_LAYOUTS[0]);

  // Step 2: 4 chosen photos
  const [capturedPhotos, setCapturedPhotos] = useState([]);

  // Step 3: placed stickers
  const [stickers, setStickers] = useState([]);

  const handleToggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    sound.setMuted(next);
  };

  const handleReset = useCallback(() => {
    setCapturedPhotos([]);
    setStickers([]);
    setSelectedTheme(FRAME_THEMES[0]);
    setSelectedColor(FRAME_COLORS[0]);
    setSelectedLayout(FRAME_LAYOUTS[0]);
    setCurrentStep(0);
  }, []);

  // Stable callbacks to avoid step3 timer re-mounting
  const goToStep = useCallback((n) => setCurrentStep(n), []);

  const isLanding = currentStep === 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header hidden on landing screen */}
      {!isLanding && (
        <Header
          currentStep={currentStep}
          onReset={handleReset}
          soundMuted={soundMuted}
          onToggleSound={handleToggleSound}
        />
      )}

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {currentStep === 0 && (
          <LandingScreen onStart={() => goToStep(1)} />
        )}

        {currentStep === 1 && (
          <Step1FrameSelect
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedLayout={selectedLayout}
            setSelectedLayout={setSelectedLayout}
            onNext={() => goToStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2CameraCapture
            capturedPhotos={capturedPhotos}
            setCapturedPhotos={setCapturedPhotos}
            onNext={() => goToStep(3)}
            onPrev={() => goToStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3StickerEditor
            capturedPhotos={capturedPhotos}
            selectedTheme={selectedTheme}
            selectedColor={selectedColor}
            selectedLayout={selectedLayout}
            stickers={stickers}
            setStickers={setStickers}
            onNext={() => goToStep(4)}
            onPrev={() => goToStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4PrintExport
            capturedPhotos={capturedPhotos}
            selectedTheme={selectedTheme}
            selectedColor={selectedColor}
            selectedLayout={selectedLayout}
            stickers={stickers}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      {!isLanding && (
        <footer
          className="no-print"
          style={{
            textAlign: 'center',
            padding: '14px 20px',
            color: 'rgba(255, 255, 255, 0.3)',
            fontSize: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          English Spectrum Photo Booth PWA • 2022 개정 영어과 선택과목 & 세특 탐구 부스 체험 시스템
        </footer>
      )}
    </div>
  );
}
