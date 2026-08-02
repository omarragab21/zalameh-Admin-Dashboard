import React, { useState, useRef, useEffect } from 'react';

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedFile: File, croppedPreviewUrl: string) => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState(false);
  const [croppedSizeKb, setCroppedSizeKb] = useState<number | null>(null);
  const [isImageReady, setIsImageReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropOperationVersionRef = useRef(0);
  const dragStartRef = useRef({
    clientX: 0,
    clientY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    cropOperationVersionRef.current += 1;
    setIsApplying(false);
    if (!isOpen || !imageSrc) {
      imageRef.current = null;
      setIsImageReady(false);
      return;
    }

    let cancelled = false;
    imageRef.current = null;
    setIsImageReady(false);
    setLoadError(null);
    setCroppedSizeKb(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      imageRef.current = img;
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
      setIsImageReady(true);
      renderPreview(img, 1, 0, 0);
    };
    img.onerror = () => {
      if (cancelled) return;
      imageRef.current = null;
      setIsImageReady(false);
      setLoadError('تعذر تحميل الصورة للقص. اختر صورة من جهازك ثم حاول مرة أخرى.');
    };
    img.src = imageSrc;

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [imageSrc, isOpen]);

  const renderPreview = (
    img: HTMLImageElement,
    currentZoom: number,
    currentOffsetX: number,
    currentOffsetY: number
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Target crop size: 400x400 square
    const size = 400;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Calculate scaling to fill 400x400
    const scale = Math.max(size / img.width, size / img.height) * currentZoom;
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    const x = (size - drawWidth) / 2 + currentOffsetX;
    const y = (size - drawHeight) / 2 + currentOffsetY;

    try {
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
    } catch {
      setIsImageReady(false);
      setLoadError('تعذر معالجة الصورة. اختر صورة من جهازك ثم حاول مرة أخرى.');
    }
  };

  useEffect(() => {
    if (!isImageReady || !imageRef.current) return;
    const frameId = requestAnimationFrame(() => {
      if (imageRef.current) renderPreview(imageRef.current, zoom, offsetX, offsetY);
    });
    return () => cancelAnimationFrame(frameId);
  }, [zoom, offsetX, offsetY, isImageReady]);

  useEffect(() => {
    if (!isImageReady) return;
    const timeoutId = window.setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        canvas.toBlob(
          (blob) => {
            if (blob) setCroppedSizeKb(Math.round(blob.size / 1024));
          },
          'image/jpeg',
          0.85
        );
      } catch {
        setIsImageReady(false);
        setLoadError('المتصفح منع معالجة هذه الصورة. اختر صورة من جهازك ثم حاول مرة أخرى.');
      }
    }, 120);
    return () => window.clearTimeout(timeoutId);
  }, [zoom, offsetX, offsetY, isImageReady]);

  if (!isOpen || !imageSrc) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      offsetX,
      offsetY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    const bounds = e.currentTarget.getBoundingClientRect();
    if (!canvas || bounds.width === 0 || bounds.height === 0) return;
    const scaleX = canvas.width / bounds.width;
    const scaleY = canvas.height / bounds.height;
    setOffsetX(
      dragStartRef.current.offsetX +
        (e.clientX - dragStartRef.current.clientX) * scaleX
    );
    setOffsetY(
      dragStartRef.current.offsetY +
        (e.clientY - dragStartRef.current.clientY) * scaleY
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  const handleClose = () => {
    cropOperationVersionRef.current += 1;
    setIsApplying(false);
    onClose();
  };

  const handleApplyCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas || !isImageReady || loadError || isApplying) return;

    const operationVersion = cropOperationVersionRef.current + 1;
    cropOperationVersionRef.current = operationVersion;
    setIsApplying(true);

    try {
      canvas.toBlob(
        (blob) => {
          if (cropOperationVersionRef.current !== operationVersion) return;
          if (!blob) {
            setIsApplying(false);
            setLoadError('تعذر حفظ الصورة بعد القص. حاول مرة أخرى.');
            return;
          }
          const file = new File([blob], `cropped_category_${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });
          const previewUrl = URL.createObjectURL(blob);
          onCropComplete(file, previewUrl);
          cropOperationVersionRef.current += 1;
          setIsApplying(false);
          onClose();
        },
        'image/jpeg',
        0.85
      );
    } catch {
      if (cropOperationVersionRef.current !== operationVersion) return;
      setIsApplying(false);
      setIsImageReady(false);
      setLoadError('المتصفح منع حفظ هذه الصورة. اختر صورة من جهازك ثم حاول مرة أخرى.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/70 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 transform transition-all my-auto flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">قص وضبط حجم الصورة</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              قم بسحب الصورة وتحديد النطاق لتعديل الحجم حتى 512KB
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body: Canvas Crop View */}
        <div className="p-6 flex flex-col items-center gap-4 bg-slate-50/50">
          <div
            className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-dashed border-[#d83f2a] shadow-inner bg-slate-900 cursor-grab active:cursor-grabbing flex items-center justify-center touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <canvas ref={canvasRef} className="w-full h-full object-cover pointer-events-none" />
            <div className="absolute inset-0 border border-white/40 pointer-events-none rounded-2xl"></div>
            {loadError && (
              <div className="absolute inset-0 bg-slate-900/90 text-red-200 text-xs font-bold p-5 flex items-center justify-center text-center">
                {loadError}
              </div>
            )}
          </div>

          {/* Controls: Zoom Slider */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>التكبير / التصغير</span>
              <span className="text-[#d83f2a]">{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              disabled={!isImageReady}
              className="w-full accent-[#d83f2a] cursor-pointer"
            />
          </div>

          {/* Size Info Badge */}
          {croppedSizeKb !== null && (
            <div className="w-full px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>حجم الصورة بعد القص:</span>
              <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-[11px]">
                {croppedSizeKb} KB (أقل من 512KB ✓)
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={!isImageReady || Boolean(loadError) || isApplying}
            className="px-5 py-2 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-bold text-xs shadow-md shadow-[#d83f2a]/20 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{isApplying ? 'جاري حفظ الصورة...' : 'تطبيق وحفظ الصورة'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
