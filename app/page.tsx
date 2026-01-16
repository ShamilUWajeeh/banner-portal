'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import MultiPhotoUploader from '@/components/MultiPhotoUploader';
import Template1 from '@/components/templates/Template1';
import Template2 from '@/components/templates/Template2';
import TemplateSelector from '@/components/TemplateSelector';
import { Loader2, Download, User, MapPin, Type, ArrowLeft } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    designation: 'امیدوار برائے جنرل کونسلر',
    ucNumber: '91',
    areaName: 'I-10/2',
    wardNumber: '1',
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Template 1 state
  const [processedImage, setProcessedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(100);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const [showGuides, setShowGuides] = useState(true);
  const [globalZoom, setGlobalZoom] = useState(100); // Global zoom for all Template 2 photos

  // Template 2 state - 9 photos
  const [template2Photos, setTemplate2Photos] = useState<Array<{
    file: File | null;
    previewUrl: string | null;
    zoom: number;
    positionX: number;
    positionY: number;
    name: string;
    wardNumber: string;
  }>>([
    ...Array(9)].map((_, i) => ({
      file: null,
      previewUrl: null,
      zoom: 100,
      positionX: 50,
      positionY: 50,
      name: '',
      wardNumber: (i + 1).toString()
    }))
  );

  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageProcessed = (file: File, zoom: number) => {
    setProcessedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageZoom(zoom);
  };

  const handleDownload = async () => {
    if (!formData.name) return alert('Please enter a name');
    if (!processedImage) return alert('Please upload a candidate photo');

    setIsGenerating(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('templateId', selectedTemplate || 'template1');
      formDataToSend.append('name', formData.name);
      formDataToSend.append('designation', formData.designation);
      formDataToSend.append('ucNumber', formData.ucNumber);
      formDataToSend.append('areaName', formData.areaName);
      formDataToSend.append('wardNumber', formData.wardNumber);
      formDataToSend.append('image', processedImage);
      formDataToSend.append('positionX', positionX.toString());
      formDataToSend.append('positionY', positionY.toString());
      formDataToSend.append('zoom', imageZoom.toString());

      const response = await fetch('/api/generate-banner', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to generate banner');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `banner-${formData.name}-UC${formData.ucNumber}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to generate banner. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">

      {/* LEFT SIDEBAR: CONTROLS (Scrollable) */}
      <div className="w-full md:w-[450px] bg-white border-r border-slate-200 flex-shrink-0 h-screen overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-8">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Poster Generator</h1>
            <p className="text-sm text-slate-500">Theme: Badlo Islamabad (JI)</p>
          </div>

          {/* 1. Photo Section */}
          {selectedTemplate && (
            <section className="space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <User size={14} /> {selectedTemplate === 'template1' ? 'Candidate Photo' : 'Candidate Photos (9)'}
              </h2>
              <div className="bg-slate-50 p-4 rounded-xl border-2 border-dashed border-slate-300">
                {selectedTemplate === 'template1' && (
                  <ImageUploader onImageProcessed={handleImageProcessed} />
                )}
                {selectedTemplate === 'template2' && (
                  <MultiPhotoUploader
                    photos={template2Photos}
                    onPhotosUpdate={setTemplate2Photos}
                    globalZoom={globalZoom}
                    onGlobalZoomChange={setGlobalZoom}
                  />
                )}
              </div>
            </section>
          )}

          {/* 2. Text Details */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Type size={14} /> Text Details
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Candidate Name (Urdu)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="سردار حنظلہ طارق"
                style={{ fontFamily: 'Faiz Lahori Nastaleeq, serif' }}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-right text-1xl focus:ring-2 focus:ring-blue-500 outline-none"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Designation (Urdu)</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                style={{ fontFamily: 'Faiz Lahori Nastaleeq, serif' }}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-right text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                dir="rtl"
              />
            </div>
          </section>

          {/* 3. Location */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin size={14} /> Location
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">UC Number</label>
                <input
                  type="text"
                  value={formData.ucNumber}
                  onChange={(e) => handleInputChange('ucNumber', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Ward</label>
                <input
                  type="text"
                  value={formData.wardNumber}
                  onChange={(e) => handleInputChange('wardNumber', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-center"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Area Name (English)</label>
              <input
                type="text"
                value={formData.areaName}
                onChange={(e) => handleInputChange('areaName', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-center uppercase"
              />
            </div>
          </section>

          {/* Footer Action */}
          <div className="pt-4 pb-12">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <Download size={20} />}
              DOWNLOAD POSTER
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT MAIN: TEMPLATE SELECTOR OR LIVE PREVIEW */}
      <div className="flex-1 bg-slate-200 flex items-center justify-center p-8 overflow-hidden h-screen">

        {/* Show Template Selector if no template selected */}
        {!selectedTemplate && (
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onSelect={(templateId) => setSelectedTemplate(templateId)}
          />
        )}

        {/* Show Template 1 Preview if selected */}
        {selectedTemplate === 'template1' && (
          <>
            {/* Back Button */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <ArrowLeft size={16} />
                <span className="font-semibold">Change Template</span>
              </button>
            </div>

            <div className="transform scale-[0.8] lg:scale-[0.9] origin-center transition-all duration-300">

              {/* --- THE POSTER CANVAS START --- */}
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

                {/* 3. TARAZU SYMBOL - CLOSER TO PHOTO */}
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
                {/* 4. UC Info (Right) - 3 LINES CENTER ALIGNED */}

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
                      onMouseDown={(e) => {
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startPosX = positionX;
                        const startPosY = positionY;

                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const deltaX = (moveEvent.clientX - startX) / 5;
                          const deltaY = (moveEvent.clientY - startY) / 5;
                          setPositionX(Math.max(0, Math.min(100, startPosX + deltaX)));
                          setPositionY(Math.max(0, Math.min(100, startPosY + deltaY)));
                        };

                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };

                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                      onTouchStart={(e) => {
                        const touch = e.touches[0];
                        const startX = touch.clientX;
                        const startY = touch.clientY;
                        const startPosX = positionX;
                        const startPosY = positionY;

                        const handleTouchMove = (moveEvent: TouchEvent) => {
                          const touch = moveEvent.touches[0];
                          const deltaX = (touch.clientX - startX) / 5;
                          const deltaY = (touch.clientY - startY) / 5;
                          setPositionX(Math.max(0, Math.min(100, startPosX + deltaX)));
                          setPositionY(Math.max(0, Math.min(100, startPosY + deltaY)));
                        };

                        const handleTouchEnd = () => {
                          document.removeEventListener('touchmove', handleTouchMove);
                          document.removeEventListener('touchend', handleTouchEnd);
                        };

                        document.addEventListener('touchmove', handleTouchMove);
                        document.addEventListener('touchend', handleTouchEnd);
                      }}
                    />
                  ) : (
                    <div className="w-[80%] h-[70%] bg-slate-400/30 rounded-t-[100px] animate-pulse pointer-events-none"></div>
                  )}
                </div>

                {/* Alignment Guide Overlay - Only show when photo is uploaded AND guides are enabled */}
                {previewUrl && showGuides && (
                  <div className="absolute inset-0 z-20 pointer-events-none">
                    {/* Left Red Zone - Tarazu Area */}
                    <div className="absolute top-60 left-0 w-[180px] h-[200px] border-2 border-red-500 bg-red-500/10 rounded">
                      <span className="absolute top-1 left-1 text-xs text-red-600 font-bold bg-white/90 px-1 rounded">Keep Clear</span>
                    </div>

                    {/* Right Red Zone - UC Text Area */}
                    <div className="absolute top-56 right-0 w-[140px] h-[180px] border-2 border-red-500 bg-red-500/10 rounded">
                      <span className="absolute top-1 right-1 text-xs text-red-600 font-bold bg-white/90 px-1 rounded">Keep Clear</span>
                    </div>

                    {/* Center Safe Zone Guide */}
                    <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-[280px] h-[500px] border-2 border-dashed border-green-500 bg-green-500/5 rounded-lg">
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-green-600 font-bold bg-white px-2 py-1 rounded shadow">
                        ✓ Safe Zone - Position face here
                      </span>
                    </div>

                    {/* Alignment Status Indicator */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-green-500">
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

                {/* 7. Footer - ON BLUE GRADIENT */}
                <div className="absolute bottom-7 w-full z-30 flex flex-col items-center justify-center">
                  <img src="/JIISB.png" alt="Jamaat-e-Islami Islamabad" className="h-12 w-auto drop-shadow-lg" />
                </div>

              </div>
              {/* --- THE POSTER CANVAS END --- */}

              <div className="mt-6 space-y-2">
                <p className="text-center text-slate-500 text-sm">Live Preview (Scale: 100%)</p>

                {/* Toggle Guides Button */}
                {previewUrl && (
                  <button
                    onClick={() => setShowGuides(!showGuides)}
                    className={`mx-auto block px-4 py-2 rounded-lg text-sm font-semibold transition-all ${showGuides
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
                      }`}
                  >
                    {showGuides ? '✓ Alignment Guides ON' : 'Alignment Guides OFF'}
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Show Template 2 Preview if selected */}
        {selectedTemplate === 'template2' && (
          <>
            {/* Back Button */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <ArrowLeft size={16} />
                <span className="font-semibold">Change Template</span>
              </button>
            </div>

            <div className="transform scale-[0.6] lg:scale-[0.7] origin-center transition-all duration-300">
              <Template2
                formData={{
                  ucNumber: formData.ucNumber,
                  areaName: formData.areaName,
                  designation: formData.designation
                }}
                photos={template2Photos}
                onPhotoUpdate={(index, updates) => {
                  const newPhotos = [...template2Photos];
                  newPhotos[index] = { ...newPhotos[index], ...updates };
                  setTemplate2Photos(newPhotos);
                }}
              />
            </div>
          </>
        )}

      </div>
    </div>
  );
}