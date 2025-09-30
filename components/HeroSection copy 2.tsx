"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { forwardRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

interface HeroSectionProps {
  selectedProduct: string;
  selectedColor: string;
  currentProduct: any;
  currentImageIndex: number;
  colorThemes: Record<string, any>;
  productData: Record<string, any>;
  isAnimating: boolean;
  scrollDirection: "up" | "down";
  activeSection: "hero" | "airmax" | "shoecard";
  currentColorTheme: any;
  onProductChange: (product: string) => void;
  onColorChange: (color: string) => void;
  onImageIndexChange: (index: number) => void;
  onNextImage: () => void;
  onPrevImage: () => void;
  onScrollDown: () => void;
}

const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      selectedProduct,
      selectedColor,
      currentProduct,
      currentImageIndex,
      colorThemes,
      productData,
      isAnimating,
      scrollDirection,
      activeSection,
      currentColorTheme,
      onProductChange,
      onColorChange,
      onImageIndexChange,
      onNextImage,
      onPrevImage,
      onScrollDown,
    },
    ref
  ) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isNavClick, setIsNavClick] = useState(false);

    const imageSrc = imageError
      ? "/images/fallback-shoe.png"
      : currentProduct.images[currentImageIndex];

    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
          setIsNavClick(true);
          onPrevImage();
        }
        if (e.key === "ArrowRight") {
          setIsNavClick(true);
          onNextImage();
        }
      };

      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }, [onPrevImage, onNextImage]);

    useEffect(() => {
      const preloadImages = () => {
        currentProduct.images.forEach((src: string) => {
          const img = new window.Image();
          img.src = src;
        });
      };

      preloadImages();
      setImagesLoaded(false);
      setImageError(false);
    }, [currentProduct]);

    const handleTouchStart = (e: React.TouchEvent) => {
      setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
      const swipeThreshold = 80;
      if (touchStart - touchEnd > swipeThreshold) {
        setIsNavClick(true);
        onNextImage();
      }
      if (touchStart - touchEnd < -swipeThreshold) {
        setIsNavClick(true);
        onPrevImage();
      }
    };

    const imageVariants = {
      initial: { x: "30%", opacity: 0, scale: 0.9 },
      animate: { x: 0, opacity: 1, scale: 1 },
      exit: { x: "-30%", opacity: 0, scale: 0.9 },
    };

    const navImageVariants = {
      initial: { opacity: 0, rotateY: 90, x: 200, scale: 0.85 },
      animate: { opacity: 1, rotateY: 0, x: 0, scale: [1.05, 0.95, 1] },
      exit: { opacity: 0, rotateY: -90, x: -200, scale: 0.9 },
    };

    const scrollImageVariants = {
      scrollDown: {
        scale: [1, 1.4, 0.9],
        y: [0, -200, 150],
        x: [0, 80, -120],
        rotate: [0, -15, 10],
        opacity: [1, 0.95, 0],
        filter: [
          "blur(0px) brightness(1)",
          "blur(2px) brightness(1.3)",
          "blur(3px) brightness(0.7)",
        ],
        transition: {
          duration: 0.6,
          times: [0, 0.5, 1],
          ease: [0.25, 0.8, 0.25, 1],
        },
      },
      scrollUp: {
        scale: [0.9, 1.4, 1],
        y: [150, -200, 0],
        x: [-120, 80, 0],
        rotate: [10, -15, 0],
        opacity: [0, 0.95, 1],
        filter: [
          "blur(3px) brightness(0.7)",
          "blur(2px) brightness(1.3)",
          "blur(0px) brightness(1)",
        ],
        transition: {
          duration: 0.6,
          times: [0, 0.5, 1],
          ease: [0.25, 0.8, 0.25, 1],
        },
      },
      normal: {
        scale: 1,
        y: 0,
        x: 0,
        rotate: 0,
        opacity: 1,
        filter: "blur(0px) brightness(1)",
      },
    };

    const getImageAnimation = () => {
      if (
        isAnimating &&
        scrollDirection === "down" &&
        activeSection === "hero"
      ) {
        return {
          variants: scrollImageVariants,
          animate: "scrollDown",
        };
      } else if (
        isAnimating &&
        scrollDirection === "up" &&
        activeSection === "airmax"
      ) {
        return {
          variants: scrollImageVariants,
          animate: "scrollUp",
        };
      } else {
        return {
          variants: isNavClick ? navImageVariants : imageVariants,
          animate: isNavClick ? "animate" : "animate",
          transition: isNavClick
            ? {
                duration: 0.7,
                ease: [0.4, 0, 0.2, 1],
                scale: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
              }
            : { duration: 0.6, ease: "easeInOut" },
        };
      }
    };

    const imageAnimation = getImageAnimation();

    return (
      <motion.section
        ref={ref}
        className={cn(
          "min-h-screen flex items-center justify-center relative overflow-hidden",
          "pt-8 lg:pt-0 text-white px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900/90 to-transparent"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ backgroundColor: currentColorTheme.bg }}
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto mt-10 sm:mt-12 lg:mt-14">
          <div className="w-full">
            {/* Mobile: Vertical Layout */}
            <div className="lg:hidden flex flex-col gap-6">
              <motion.div
                className="text-center"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h1 className="text-2xl sm:text-3xl font-playfair font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Wear your Style
                </h1>
                <p className="text-base sm:text-lg text-gray-200 mt-2">
                  with comfort.
                </p>
              </motion.div>

              <motion.div
                className="flex justify-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {(Object.keys(productData) as string[])
                  .filter((key) => key !== selectedProduct)
                  .map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        onProductChange(key);
                        onColorChange(key);
                        onImageIndexChange(0);
                      }}
                      className={`w-16 sm:w-20 h-12 sm:h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedProduct === key
                          ? "border-white scale-110 shadow-lg shadow-white/20"
                          : "border-gray-600 hover:border-white"
                      }`}
                      aria-label={`Select ${productData[key].name}`}
                    >
                      <Image
                        src={productData[key].images[0]}
                        alt={productData[key].name}
                        width={80}
                        height={56}
                        sizes="(max-width: 640px) 80px, 120px"
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
              </motion.div>

              <div className="relative flex justify-center items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsNavClick(true);
                    onPrevImage();
                  }}
                  className="absolute left-2 z-20 text-white border-2 border-white/40 rounded-full hover:bg-white/20 backdrop-blur-sm h-12 w-12"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <div className="relative w-full max-w-[360px] sm:max-w-[400px]">
                  <AnimatePresence mode={isNavClick ? "sync" : "wait"}>
                    <motion.div
                      key={`${selectedProduct}-${currentImageIndex}`}
                      variants={imageAnimation.variants}
                      initial="initial"
                      animate={imageAnimation.animate}
                      exit="exit"
                      transition={imageAnimation.transition}
                      className="relative z-10 cursor-pointer"
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onClick={onScrollDown}
                    >
                      {imageError ? (
                        <div className="flex items-center justify-center h-[320px] sm:h-[350px] text-red-500">
                          Failed to load image
                        </div>
                      ) : !imagesLoaded ? (
                        <div className="flex items-center justify-center h-[320px] sm:h-[350px]">
                          <div
                            className={`animate-spin h-8 w-8 border-4 border-t-${currentColorTheme.accent} border-gray-600 rounded-full`}
                          />
                        </div>
                      ) : (
                        <Image
                          src={imageSrc}
                          alt={currentProduct.name}
                          width={400}
                          height={350}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain w-full h-auto"
                          priority
                          onLoad={() => setImagesLoaded(true)}
                          onError={() => setImageError(true)}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsNavClick(true);
                    onNextImage();
                  }}
                  className="absolute right-2 z-20 text-white border-2 border-white/40 rounded-full hover:bg-white/20 backdrop-blur-sm h-12 w-12"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              <motion.div
                className="flex gap-2 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                {currentProduct.images.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => onImageIndexChange(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white scale-125"
                        : "bg-gray-600"
                    }`}
                    aria-label={`Select image ${index + 1}`}
                  />
                ))}
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <span className="text-lg sm:text-xl font-playfair font-semibold text-white">
                  {currentProduct.name}
                </span>
              </motion.div>

              <motion.button
                className="relative flex items-center justify-center gap-3 
                           w-full max-w-[360px] mx-auto px-6 py-4 
                           rounded-xl font-semibold text-base sm:text-lg 
                           text-white bg-gradient-to-r from-gray-900 to-gray-700 
                           border-0 shadow-lg
                           active:scale-95 transition-all duration-300
                           group overflow-hidden mt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                whileTap={{ scale: 0.95 }}
                onClick={onScrollDown}
                aria-label="Discover more about this product"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] 
                                transition-transform duration-1000"
                />
                <ShoppingCart className="w-5 sm:w-6 h-5 sm:h-6 transition-transform group-hover:scale-110" />
                <span className="font-semibold tracking-wide">
                  Discover More
                </span>
              </motion.button>

              <motion.div
                className="flex gap-3 justify-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                {currentProduct.images.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => onImageIndexChange(index)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-white scale-105 shadow-md shadow-white/20"
                        : "border-gray-600"
                    }`}
                    aria-label={`Select image ${index + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`Preview ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 80px, 120px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Desktop: Original Layout */}
            <div className="hidden lg:flex flex-col-reverse lg:flex-row items-center justify-center gap-6 relative mt-10">
              <motion.div
                className="flex flex-col gap-6 items-start self-start"
                initial={{ y: 80, opacity: 0, filter: "blur(10px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{
                  delay: 0.3,
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <motion.h1
                  className="text-4xl font-light leading-tight"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.8,
                    scale: { duration: 0.2 },
                  }}
                >
                  <motion.span
                    className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-playfair font-semibold"
                    whileHover={{ backgroundPosition: "100% 50%" }}
                    style={{
                      backgroundSize: "200% 100%",
                      backgroundPosition: "0% 50%",
                      transition: "background-position 0.5s ease",
                    }}
                  >
                    Wear your Style
                  </motion.span>
                  <motion.span
                    className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-playfair font-semibold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    with comfort.
                  </motion.span>
                </motion.h1>
              </motion.div>

              <div className="relative flex-1 flex justify-center items-center overflow-hidden max-w-[800px] mx-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsNavClick(true);
                    onPrevImage();
                  }}
                  className="text-white border-2 border-white/40 rounded-full hover:bg-white/20 backdrop-blur-sm h-12 w-12 transition-all hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <div
                  className="relative w-full max-w-[800px] h-[440px] flex justify-center items-center"
                  style={{ perspective: "1500px" }}
                >
                  <AnimatePresence mode={isNavClick ? "sync" : "wait"}>
                    <motion.div
                      key={`${selectedProduct}-${currentImageIndex}`}
                      variants={imageAnimation.variants}
                      initial="initial"
                      animate={imageAnimation.animate}
                      exit="exit"
                      transition={imageAnimation.transition}
                      className={
                        isNavClick
                          ? "absolute inset-0 flex items-center justify-center"
                          : "relative z-10 cursor-pointer"
                      }
                      style={{ transformStyle: "preserve-3d" }}
                      whileHover={{ scale: 1.05 }}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onClick={onScrollDown}
                    >
                      <Image
                        src={imageSrc}
                        alt={currentProduct.name}
                        width={800}
                        height={700}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain w-full h-auto max-h-[700px] sm:max-h-[600px] md:max-h-[700px] cursor-pointer"
                        priority
                        onLoad={() => setImagesLoaded(true)}
                        onError={() => setImageError(true)}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsNavClick(true);
                    onNextImage();
                  }}
                  className="text-white border-2 border-white/40 rounded-full hover:bg-white/20 backdrop-blur-sm h-12 w-12 transition-all hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              <motion.div
                className="flex flex-row lg:flex-col gap-4 items-start self-start"
                initial="initial"
                animate="animate"
              >
                {(Object.keys(productData) as string[])
                  .filter((key) => key !== selectedProduct)
                  .map((key) => (
                    <motion.button
                      key={key}
                      initial={{ scale: 0.8, opacity: 0, x: 20 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      onClick={() => {
                        onProductChange(key);
                        onColorChange(key);
                        onImageIndexChange(0);
                      }}
                      className={`relative w-24 h-16 lg:w-28 lg:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedProduct === key
                          ? "border-white scale-110 shadow-lg shadow-white/20"
                          : "border-gray-700 hover:border-white"
                      } group`}
                      whileHover={{
                        scale: 1.15,
                        y: -5,
                        boxShadow: "0 8px 20px rgba(255,255,255,0.15)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Select ${productData[key].name}`}
                    >
                      <Image
                        src={productData[key].images[0]}
                        alt={productData[key].name}
                        fill
                        sizes="(max-width: 640px) 80px, 120px"
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    </motion.button>
                  ))}
              </motion.div>
            </div>
          </div>

          {/* Desktop Footer */}
          <div className="hidden lg:flex flex-col lg:flex-row justify-between items-center mt-8 gap-6">
            <motion.span
              className="text-2xl font-light text-gray-200 font-playfair"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {currentProduct.name}
            </motion.span>

            <motion.div
              className="flex gap-2 items-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.6,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              {currentProduct.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => onImageIndexChange(index)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? "border-white scale-105 shadow-md shadow-white/20"
                      : "border-gray-700 hover:border-white hover:scale-105"
                  }`}
                  aria-label={`Select image ${index + 1}`}
                >
                  <Image
                    src={img}
                    alt={`Preview ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 80px, 120px"
                    className="object-cover transition-transform hover:scale-110"
                  />
                </button>
              ))}
            </motion.div>

            <motion.button
              className="relative flex items-center justify-center gap-3 
                         w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-4 
                         rounded-xl font-semibold text-base sm:text-lg 
                         text-white bg-gradient-to-r from-gray-900 to-gray-700 shadow-gray-900/25
                         border-0 hover:shadow-xl hover:shadow-purple-500/40 
                         hover:from-purple-700 hover:to-blue-600
                         active:scale-95 transition-all duration-300
                         group overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onScrollDown}
              aria-label="Discover more about this product"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                              -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] 
                              transition-transform duration-1000"
              />
              <ShoppingCart className="w-5 sm:w-6 h-5 sm:h-6 transition-transform group-hover:scale-110" />
              <span className="font-semibold tracking-wide">Discover More</span>
            </motion.button>
          </div>
        </div>
      </motion.section>
    );
  }
);

HeroSection.displayName = "HeroSection";

export default HeroSection;