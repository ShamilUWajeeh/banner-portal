'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageProcessed: (file: File, zoom: number) => void;
}

export default function ImageUploader({ onImageProcessed }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Just show preview and pass the file directly (no background removal)
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setCurrentFile(file);
    onImageProcessed(file, zoom);
  }, [onImageProcessed, zoom]);

  // Update parent when zoom changes
  useEffect(() => {
    if (currentFile) {
      onImageProcessed(currentFile, zoom);
    }
  }, [zoom, currentFile, onImageProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1
  });

  const clearImage = () => {
    setPreview(null);
    setZoom(100);
    setCurrentFile(null);
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-lg border-2 border-slate-200 bg-slate-100" style={{ height: '192px' }}>
            <img
              src={preview}
              alt="Preview"
              className="absolute top-1/2 left-1/2 object-cover"
              style={{
                transform: `translate(-50%, -50%) scale(${zoom / 100})`,
                maxWidth: 'none',
                height: '100%'
              }}
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 z-10"
            >
              <X size={16} />
            </button>
          </div>

          {/* Zoom Slider */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 flex items-center justify-between">
              <span>Zoom: {zoom}%</span>
            </label>
            <input
              type="range"
              min="50"
              max="200"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-slate-50'}`}
        >
          <input {...getInputProps()} />
          <div className="text-gray-500">
            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="font-semibold">Drop candidate photo here</p>
            <p className="text-sm mt-2">or click to select</p>
            <p className="text-xs mt-2 text-slate-400">JPG, PNG (Background removal disabled)</p>
          </div>
        </div>
      )}
    </div>
  );
}