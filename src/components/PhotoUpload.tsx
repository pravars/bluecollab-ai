import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Eye } from 'lucide-react';

interface PhotoUploadProps {
  photos: JobPhoto[];
  onPhotosChange: (photos: JobPhoto[]) => void;
  maxPhotos?: number;
  disabled?: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  photos, 
  onPhotosChange, 
  maxPhotos = 10,
  disabled = false 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || uploading) return;

    const newFiles = Array.from(files).slice(0, maxPhotos - photos.length);
    
    if (newFiles.length === 0) {
      alert(`Maximum ${maxPhotos} photos allowed.`);
      return;
    }

    setUploading(true);
    let processedCount = 0;
    const totalFiles = newFiles.length;

    newFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Please select files under 10MB.`);
          processedCount++;
          if (processedCount === totalFiles) setUploading(false);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          const newPhoto: JobPhoto = {
            url,
            filename: file.name,
            originalName: file.name,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            description: ''
          };
          
          onPhotosChange([...photos, newPhoto]);
          setPreviewUrls(prev => [...prev, url]);
          
          processedCount++;
          if (processedCount === totalFiles) setUploading(false);
        };
        reader.readAsDataURL(file);
      } else {
        alert(`File ${file.name} is not a valid image. Please select PNG, JPG, or GIF files.`);
        processedCount++;
        if (processedCount === totalFiles) setUploading(false);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
    setPreviewUrls(newPreviewUrls);
  };

  const updatePhotoDescription = (index: number, description: string) => {
    const newPhotos = [...photos];
    newPhotos[index] = { ...newPhotos[index], description };
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Photos ({photos.length}/{maxPhotos})
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Upload photos to help service providers understand the scope of work better
        </p>
      </div>

      {/* Upload Area */}
      {photos.length < maxPhotos && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        >
          <Upload className={`w-8 h-8 mx-auto mb-2 ${uploading ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-600 mb-1">
            {uploading 
              ? 'Processing photos...' 
              : isDragging 
                ? 'Drop photos here' 
                : 'Click to upload or drag and drop'
            }
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB each (max {maxPhotos} photos)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={disabled || uploading}
          />
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={photo.url}
                  alt={photo.originalName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => window.open(photo.url, '_blank')}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="View full size"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                      title="Remove photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Photo description */}
              <div className="mt-2">
                <input
                  type="text"
                  value={photo.description || ''}
                  onChange={(e) => updatePhotoDescription(index, e.target.value)}
                  placeholder="Add description (optional)"
                  className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={disabled}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo count warning */}
      {photos.length >= maxPhotos && (
        <p className="text-sm text-amber-600 flex items-center">
          <ImageIcon className="w-4 h-4 mr-1" />
          Maximum {maxPhotos} photos reached
        </p>
      )}
    </div>
  );
};

export default PhotoUpload;