"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import type { HeroSectionProps } from "../HeroSection";

const ANIMATION_DURATION = 700;

const ImageSlider = (props: HeroSectionProps) => {
  const {
    selectedProduct,
    currentProduct,
    currentImageIndex,
    imagesLoaded,
    imageError,
    ellipseError,
    isNavClick,
    isMobile,
    onNextImage,
    onPrevImage,
    onImageClick,
    showPreview,
  } = props;

  const imageSrc = imageError || !currentProduct.images[currentImageIndex]
    ? "/images/fallback-shoe.png"
    : currentProduct.images[currentImageIndex];

  return (
    <div className="relative flex-1 flex justify-center items-center overflow-visible max-w-[90vw] mx-auto">
      {/* Prev Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevImage}
        className="absolute left-2 z-20 text-white border-2 border-white/40 rounded-full hover:bg-white/20 backdrop-blur-sm h-12 w-12 transition-all hover:scale-110"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <div
        className="relative w-full h-[80vh] flex justify-center items-center overflow-visible"
        style={{ perspective: "1500px" }}
      >
        <AnimatePresence mode="sync">
          {imagesLoaded && !imageError && (
            <motion.div
              key={`image-${selectedProduct}-${currentImageIndex}`}
              className="absolute inset-0 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              onClick={onImageClick}
            >
              <Image
                src={imageSrc}
                alt={currentProduct.name}
                width={1600}
                height={900}
                sizes="90vw"
                className="w-[60vw] max-w-[1000px] h-auto drop-shadow-2xl transition-transform duration-500"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ellipse */}
        <motion.div
          className="absolute bottom-0 md:bottom-22 w-full flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.7, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          {!ellipseError ? (
            <Image
              src="/ellips.svg"
              alt="Ellipse"
              width={1200}
              height={80}
              className="w-[60vw] max-w-[1000px] h-auto"
              style={{
                filter:
                  "blur(6px) drop-shadow(0 0 25px rgba(0,0,0,0.5)) drop-shadow(0 0 40px rgba(0,0,0,0.25))",
              }}
            />
          ) : (
            <div className="w-[60vw] max-w-[1000px] h-20 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full blur-sm" />
          )}
        </motion.div>
      </div>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onNextImage}
        className="absolute right-2 z-20 text-white border-2 border-white/40 rounded-full hover:bg-white/20 backdrop-blur-sm h-12 w-12 transition-all hover:scale-110"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ImageSlider;
