import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: Array<{
    src: string;
    alt: string;
    title?: string;
  }>;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Lightbox = ({ images, currentIndex, isOpen, onClose }: LightboxProps) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  const goToPrevious = () => {
    setActiveIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
  };

  const goToNext = () => {
    setActiveIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
  };

  if (!images.length) return null;

  const currentImage = images[activeIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Main image */}
          <div className="w-full h-full flex items-center justify-center p-8">
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Image title */}
          {currentImage.title && (
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white text-lg font-medium bg-black/50 rounded px-4 py-2">
                {currentImage.title}
              </p>
            </div>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <span className="text-white bg-black/50 rounded px-3 py-1 text-sm">
                {activeIndex + 1} / {images.length}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};