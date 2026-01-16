'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, ZoomIn } from 'lucide-react';

interface PhotoData {
    file: File | null;
    previewUrl: string | null;
    zoom: number;
    positionX: number;
    positionY: number;
    name: string;
    wardNumber: string;
}

interface MultiPhotoUploaderProps {
    photos: PhotoData[];
    onPhotosUpdate: (photos: PhotoData[]) => void;
    globalZoom: number;
    onGlobalZoomChange: (zoom: number) => void;
}

export default function MultiPhotoUploader({ photos, onPhotosUpdate, globalZoom, onGlobalZoomChange }: MultiPhotoUploaderProps) {
    // Handle batch upload
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newPhotos = [...photos];
        acceptedFiles.slice(0, 9).forEach((file, index) => {
            if (index < 9) {
                newPhotos[index] = {
                    ...newPhotos[index],
                    file,
                    previewUrl: URL.createObjectURL(file),
                    zoom: globalZoom // Use global zoom
                };
            }
        });
        onPhotosUpdate(newPhotos);
    }, [photos, onPhotosUpdate, globalZoom]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        multiple: true,
        maxFiles: 9
    });

    // Handle individual upload
    const handleIndividualUpload = (index: number, file: File) => {
        const newPhotos = [...photos];
        newPhotos[index] = {
            ...newPhotos[index],
            file,
            previewUrl: URL.createObjectURL(file),
            zoom: globalZoom // Use global zoom
        };
        onPhotosUpdate(newPhotos);
    };

    // Handle name change
    const handleNameChange = (index: number, name: string) => {
        const newPhotos = [...photos];
        newPhotos[index] = { ...newPhotos[index], name };
        onPhotosUpdate(newPhotos);
    };

    // Clear photo
    const clearPhoto = (index: number) => {
        const newPhotos = [...photos];
        newPhotos[index] = {
            file: null,
            previewUrl: null,
            zoom: globalZoom,
            positionX: 50,
            positionY: 50,
            name: '',
            wardNumber: (index + 1).toString()
        };
        onPhotosUpdate(newPhotos);
    };

    // Update all photos with new global zoom
    const handleGlobalZoom = (newZoom: number) => {
        onGlobalZoomChange(newZoom);
        const newPhotos = photos.map(photo => ({
            ...photo,
            zoom: newZoom
        }));
        onPhotosUpdate(newPhotos);
    };

    return (
        <div className="space-y-4">
            {/* Batch Upload */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 hover:border-blue-400 bg-slate-50'
                    }`}
            >
                <input {...getInputProps()} />
                <Upload size={40} className="mx-auto mb-3 text-slate-400" />
                <p className="text-base font-semibold text-slate-700 mb-1">
                    {isDragActive ? 'Drop photos here...' : 'Upload 9 Candidate Photos'}
                </p>
                <p className="text-xs text-slate-500">
                    Drag & drop 9 photos or click to select
                </p>
            </div>

            {/* Global Zoom Slider */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                    <ZoomIn size={18} className="text-blue-600" />
                    <span className="text-sm font-bold text-blue-900">Global Zoom (All Photos)</span>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="range"
                        min="50"
                        max="200"
                        value={globalZoom}
                        onChange={(e) => handleGlobalZoom(parseInt(e.target.value))}
                        className="flex-1 h-2"
                    />
                    <span className="text-sm font-bold text-blue-700 w-14">{globalZoom}%</span>
                </div>
            </div>

            {/* Individual Photo Upload Grid */}
            <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                    <div key={index} className="space-y-2">
                        {/* Photo Upload */}
                        <div className="relative bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-300 aspect-square">
                            {photo.previewUrl ? (
                                <>
                                    <img
                                        src={photo.previewUrl}
                                        alt={`Candidate ${index + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        onClick={() => clearPhoto(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-slate-200 transition-all">
                                    <Upload size={20} className="text-slate-400 mb-1" />
                                    <span className="text-xs text-slate-500">Photo {index + 1}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleIndividualUpload(index, file);
                                        }}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Ward Number (read-only) */}
                        <div className="text-xs text-center text-slate-500 font-bold">
                            WARD {photo.wardNumber}
                        </div>
                    </div>
                ))}
            </div>

            {/* 9 Separate Name Input Boxes */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-lg">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Candidate Names (Urdu)</h3>
                <div className="grid grid-cols-1 gap-2">
                    {photos.map((photo, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 w-16">Ward {index + 1}:</span>
                            <input
                                type="text"
                                placeholder={`نام ${index + 1}`}
                                value={photo.name}
                                onChange={(e) => handleNameChange(index, e.target.value)}
                                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg"
                                style={{ fontFamily: 'Faiz Lahori Nastaleeq, serif', direction: 'rtl' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
