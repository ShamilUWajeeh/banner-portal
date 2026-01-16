'use client';

import { useState } from 'react';

interface Template1Props {
  formData: {
    name: string;
    designation: string;
    ucNumber: string;
    areaName: string;
    wardNumber: string;
  };
  previewUrl: string | null;
  imageZoom: number;
  positionX: number;
  positionY: number;
  onPositionChange: (x: number, y: number) => void;
  showGuides?: boolean;
}

export default function Template1({
  formData,
  previewUrl,
  imageZoom,
  positionX,
  positionY,
  onPositionChange,
  showGuides = true
}: Template1Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = positionX;
    const startPosY = positionY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / 5;
      const deltaY = (moveEvent.clientY - startY) / 5;
      onPositionChange(
        Math.max(0, Math.min(100, startPosX + deltaX)),
        Math.max(0, Math.min(100, startPosY + deltaY))
      );
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const startPosX = positionX;
    const startPosY = positionY;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const touch = moveEvent.touches[0];
      const deltaX = (touch.clientX - startX) / 5;
      const deltaY = (touch.clientY - startY) / 5;
      onPositionChange(
        Math.max(0, Math.min(100, startPosX + deltaX)),
        Math.max(0, Math.min(100, startPosY + deltaY))
      );
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      className="relative bg-white shadow-2xl overflow-hidden flex flex-col"
      style={{ width: '500px', height: '833px' }}
    >
      {/* 1. Background - GRADIENT BLUE */}
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to bottom, #3392d0, #12499f)' }}></div>

      {/* 2. TOP BAR - BADLO NIZAM LOGO */}
      <div className="absolute top-0 left-0 w-full h-24 bg-white z-30 flex items-center justify-center shadow-sm">
        <img src="/badlo nizam logo.png" alt="Badlo Nizam" className="h-[300px] w-auto max-w-[90%] object-contain" />
      </div>

      {/* 3. TARAZU SYMBOL */}
      <div className="absolute top-[180px] left-[15px] z-30">
        <img src="/tarazu logo.png" alt="Tarazu" className="w-[150px] h-[150px] object-contain drop-shadow-xl" />
        <div className="-mt-[40px] text-right max-w-[130px]">
          <span style={{ fontFamily: 'Faiz Lahori Nastaleeq, serif' }}>
            <span className="text-white text-2xl font-bold drop-shadow-lg">انتخابی</span>
            {' '}
            <span className="text-white text-2xl font-bold drop-shadow-lg">نشان</span>
            {' '}
            <span className="text-[#FFEB3B] text-[35px] font-bold drop-shadow-lg">ترازو</span>
          </span>
        </div>
      </div>

      {/* 4. UC Info (Right) */}
      <div className="absolute top-[200px] right-11 z-20 text-center">
        <div className="text-white font-bold text-[68px] leading-none drop-shadow-lg" style={{ fontFamily: 'Barlow ExtraBold, sans-serif' }}>
          UC
        </div>
        <div className="text-white font-bold text-[60px] leading-none -mt-3 drop-shadow-lg" style={{ fontFamily: 'Barlow ExtraBold, sans-serif' }}>
          {formData.ucNumber}
        </div>
        <div className="text-[#FFEB3B] font-bold text-[30px] leading-none -mt-2 drop-shadow-lg" style={{ fontFamily: 'Barlow ExtraBold, sans-serif' }}>
          {formData.areaName}
        </div>
      </div>

      {/* 5. Candidate Photo (DRAGGABLE) */}
      <div className="absolute inset-0 top-24 flex items-start justify-center z-10">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Candidate"
            className="h-[92%] w-auto object-cover photo-fade-mask absolute cursor-move"
            style={{
              transform: `translate(-50%, 0) scale(${imageZoom / 100})`,
              left: `${positionX}%`,
              top: `${positionY - 50}%`,
              userSelect: 'none'
            }}
            draggable={false}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />
        ) : (
          <div className="h-[92%] w-auto flex items-center justify-center text-white/50 text-xl">
            Upload Photo
          </div>
        )}
      </div>

      {/* Alignment Guides */}
      {showGuides && (
        <div className="absolute inset-0 pointer-events-none z-40">
          {/* Keep Clear Zones */}
          <div className="absolute top-[180px] left-[15px] w-[150px] h-[150px] border-2 border-red-500 bg-red-500/10">
            <span className="text-red-500 text-xs font-bold">Keep Clear: Tarazu</span>
          </div>
          <div className="absolute top-[200px] right-11 w-[120px] h-[200px] border-2 border-red-500 bg-red-500/10">
            <span className="text-red-500 text-xs font-bold">Keep Clear: UC</span>
          </div>

          {/* Safe Zone for Face */}
          <div className="absolute top-[240px] left-1/2 -translate-x-1/2 w-[200px] h-[200px] border-2 border-green-500 border-dashed bg-green-500/10">
            <span className="text-green-500 text-xs font-bold text-center block">Safe Zone: Position Face Here</span>
          </div>

          {/* Alignment Status */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-green-700">Photo Aligned</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. Name Text (Front Layer) */}
      <div className="absolute bottom-28 w-full z-30 text-center px-4">
        <h1 className="text-white text-8xl font-bold mb-3 leading-tight text-stroke" style={{
          fontFamily: 'Faiz Lahori Nastaleeq, serif'
        }}>
          {formData.name || 'سردار حنظلہ طارق'}
        </h1>
        <p className="text-white text-3xl mb-1 text-stroke" style={{
          fontFamily: 'Faiz Lahori Nastaleeq, serif'
        }}>
          {formData.designation}
        </p>
        <p className="text-white text-3xl font-bold text-stroke" style={{
          fontFamily: 'Montserrat, sans-serif'
        }}>
          WARD {formData.wardNumber}
        </p>
      </div>

      {/* 7. Footer - JIISB Logo */}
      <div className="absolute bottom-4 w-full z-30 flex flex-col items-center justify-center">
        <img src="/JIISB.png" alt="Jamaat-e-Islami Islamabad" className="h-12 w-auto drop-shadow-lg" />
      </div>
    </div>
  );
}
