import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, Check, Image as ImageIcon } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface Props {
  onCropComplete: (croppedImage: any) => void;
  aspectRatio?: number; // e.g., 16/9 or 1
  label?: string;
  returnBlob?: boolean;
}

export const ImageUploaderWithCrop: React.FC<Props> = ({ 
  onCropComplete, 
  aspectRatio = 16/9,
  label = "Subir Imagen",
  returnBlob = false
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImage(reader.result as string);
        setShowCropper(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onCropCompleteInternal = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return '';
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  const getCroppedImgBlob = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas is empty'));
      }, 'image/jpeg');
    });
  };

  const handleConfirmCrop = async () => {
    if (image && croppedAreaPixels) {
      if (returnBlob) {
        const blob = await getCroppedImgBlob(image, croppedAreaPixels);
        onCropComplete(blob);
      } else {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        onCropComplete(croppedImage);
      }
      setShowCropper(false);
      setImage(null);
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors bg-white">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
          <p className="mb-2 text-sm text-slate-500 font-bold uppercase tracking-widest">{label}</p>
          <p className="text-xs text-slate-400">PNG, JPG o JPEG</p>
        </div>
        <input type="file" className="hidden" accept="image/*" onChange={onSelectFile} />
      </label>

      {showCropper && image && (
        <div className="fixed inset-0 z-[600] bg-panorama-navy/90 flex flex-col items-center justify-center p-4 md:p-8">
          <div className="relative w-full max-w-4xl aspect-video bg-panorama-darkNavy rounded-3xl overflow-hidden shadow-2xl">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={onCropChange}
              onCropComplete={onCropCompleteInternal}
              onZoomChange={onZoomChange}
            />
          </div>

          <div className="mt-8 w-full max-w-lg bg-white p-6 rounded-3xl shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="font-news font-black text-panorama-navy uppercase tracking-widest">Ajustar Imagen</h3>
              <button 
                onClick={() => setShowCropper(false)}
                className="text-slate-400 hover:text-panorama-red transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <ZoomOut size={20} className="text-slate-400" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => onZoomChange(Number(e.target.value))}
                className="flex-grow h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-panorama-red"
              />
              <ZoomIn size={20} className="text-slate-400" />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowCropper(false)}
                className="flex-grow py-4 rounded-xl font-black uppercase text-xs tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmCrop}
                className="flex-grow bg-panorama-red text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-panorama-darkRed transition-all shadow-lg"
              >
                <Check size={18} /> Confirmar Recorte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
