'use client';

import { useState } from 'react';

interface PhotoData {
    file: File | null;
    previewUrl: string | null;
    zoom: number;
    positionX: number;
    positionY: number;
    name: string;
    wardNumber: string;
}

interface Template2Props {
    formData: {
        ucNumber: string;
        areaName: string;
        designation: string;
    };
    photos: PhotoData[];
    onPhotoUpdate: (index: number, updates: Partial<PhotoData>) => void;
}

export default function Template2({ formData, photos, onPhotoUpdate }: Template2Props) {
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const handlePhotoMouseDown = (index: number, e: React.MouseEvent) => {
        setDraggingIndex(index);
        const startX = e.clientX;
        const startY = e.clientY;
        const startPosX = photos[index].positionX;
        const startPosY = photos[index].positionY;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = (moveEvent.clientX - startX) / 3;
            const deltaY = (moveEvent.clientY - startY) / 3;
            onPhotoUpdate(index, {
                positionX: Math.max(0, Math.min(100, startPosX + deltaX)),
                positionY: Math.max(0, Math.min(100, startPosY + deltaY))
            });
        };

        const handleMouseUp = () => {
            setDraggingIndex(null);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Split photos into two rows: 4 top, 5 bottom
    const topRowPhotos = photos.slice(0, 4);
    const bottomRowPhotos = photos.slice(4, 9);

    const renderPhotoCard = (photo: PhotoData, index: number) => (
        <div key={index} className="relative w-[140px] h-[170px]">
            {photo.previewUrl ? (
                <>
                    {/* Photo with FADE MASK - fades lower body into blue background */}
                    <img
                        src={photo.previewUrl}
                        alt={`Candidate ${index + 1}`}
                        className="w-full h-full object-contain cursor-move photo-fade-mask"
                        style={{
                            transform: `translate(-50%, -50%) scale(${photo.zoom / 100})`,
                            left: `${photo.positionX}%`,
                            top: `${photo.positionY}%`,
                            userSelect: 'none',
                            position: 'absolute'
                        }}
                        draggable={false}
                        onMouseDown={(e) => handlePhotoMouseDown(index, e)}
                    />

                    {/* Text Overlay - appears on faded blue background */}
                    <div className="absolute bottom-0 left-0 right-0 pb-1.5 px-2 pointer-events-none">
                        <p className="text-white text-sm font-bold text-center leading-tight mb-0.5" style={{ fontFamily: 'Faiz Lahori Nastaleeq, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                            {photo.name || 'سردار حنظلہ طارق'}
                        </p>
                        <p className="text-white text-[9px] text-center leading-tight mb-0.5" style={{ fontFamily: 'Faiz Lahori Nastaleeq, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                            {formData.designation}
                        </p>
                        <p className="text-white text-[10px] font-bold text-center" style={{ fontFamily: 'Montserrat, sans-serif', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                            WARD {photo.wardNumber}
                        </p>
                    </div>
                </>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/30 text-xs">Photo {index + 1}</span>
                </div>
            )}
        </div>
    );

    return (
        <div
            className="relative bg-white shadow-2xl overflow-hidden"
            style={{ width: '1200px', height: '400px' }}
        >
            {/* LEFT PANEL - Blue Gradient with VERY LARGE Tarazu */}
            <div
                className="absolute left-0 top-0 w-[250px] h-full z-10 flex flex-col items-center justify-center"
                style={{ background: 'linear-gradient(to bottom, #3392d0, #12499f)' }}
            >
                <div className="flex flex-col items-center">
                    {/* UC Block - Very close to Tarazu */}
                    <div className="text-center mb-0">
                        <div className="text-white font-bold text-[56px] leading-none drop-shadow-lg" style={{ fontFamily: 'Barlow ExtraBold, sans-serif' }}>
                            UC-{formData.ucNumber}
                        </div>
                        <div className="text-[#FFEB3B] font-bold text-[28px] leading-none mt-1 drop-shadow-lg" style={{ fontFamily: 'Barlow ExtraBold, sans-serif' }}>
                            {formData.areaName}
                        </div>
                    </div>

                    {/* VERY LARGE Tarazu Logo - 240px */}
                    <img src="/tarazu logo.png" alt="Tarazu" className="w-[240px] h-[240px] object-contain drop-shadow-xl -mt-9" />

                    {/* Urdu Text - DIRECTLY beneath Tarazu, touching it */}
                    <div className="text-center max-w-[230px] -mt-11">
                        <span style={{ fontFamily: 'Faiz Lahori Nastaleeq, serif' }}>
                            <span className="text-white text-2xl font-bold drop-shadow-lg">انتخابی</span>
                            {' '}
                            <span className="text-white text-2xl font-bold drop-shadow-lg">نشان</span>
                            {' '}
                            <span className="text-[#FFEB3B] text-5xl font-bold drop-shadow-lg">ترازو</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* CENTER PANEL - 9 Photos with REDUCED spacing */}
            <div
                className="absolute left-[250px] top-0 w-[700px] h-full z-20 flex flex-col items-center justify-center gap-0 p-6"
                style={{ background: 'linear-gradient(to bottom, #3392d0, #12499f)' }}
            >
                {/* Top Row - 4 Photos */}
                <div className="flex justify-center -gap-5">
                    {topRowPhotos.map((photo, index) => renderPhotoCard(photo, index))}
                </div>

                {/* Bottom Row - 5 Photos */}
                <div className="flex justify-center -gap-5">
                    {bottomRowPhotos.map((photo, index) => renderPhotoCard(photo, index + 4))}
                </div>
            </div>

            {/* RIGHT PANEL - Static Image */}
            <div className="absolute right-0 top-0 w-[250px] h-full bg-white z-10">
                <img
                    src="/right-panel.png"
                    alt="Right Panel Design"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
