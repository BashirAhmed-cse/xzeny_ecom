
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { forwardRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

type ProductColor = "black" | "red";

interface Product {
  name: string;
  images: string[];
  releaseDate: string;
  colorWay: string;
}

interface ColorTheme {
  bg: string;
  gradient: string;
  text: string;
}

interface HeroSectionProps {
  selectedProduct: ProductColor;
  selectedColor: ProductColor;
  currentProduct: Product;
  currentImageIndex: number;
  colorThemes: Record<ProductColor, ColorTheme>;
  productData: Record<ProductColor, Product>;
  isAnimating: boolean;
  scrollDirection: "up" | "down";
  activeSection: "hero" | "airmax" | "shoecard";
  currentColorTheme: ColorTheme;
  onProductChange: (product: ProductColor) => void;
  onColorChange: (color: ProductColor) => void;
  onImageIndexChange: (index: number) => void;
  onNextImage: () => void;
  onPrevImage: () => void;
  onScrollDown: () => void;
  onImageClick: () => void;
  showPreview: boolean;
}

const ANIMATION_DURATION = 700;

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
      onImageClick,
      showPreview,
    },
    ref
  ) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageLoadTimeout, setImageLoadTimeout] = useState<NodeJS.Timeout | null>(null);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isNavClick, setIsNavClick] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const swipeThreshold = isMobile ? 60 : 80;

    const imageSrc = imageError || !currentProduct.images[currentImageIndex]
      ? "/images/fallback-shoe.png"
      : currentProduct.images[currentImageIndex];

    useEffect(() => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 1024);

      const handleResize = () => {
        setIsMobile(window.innerWidth < 1024);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

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
        if (e.key === "Escape" && showPreview) {
          onImageClick();
        }
      };

      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }, [onPrevImage, onNextImage, showPreview, onImageClick]);

    useEffect(() => {
      const preloadImages = () => {
        if (!currentProduct.images.length) {
          console.log("No images to preload for", currentProduct.name);
          setImageError(true);
          return;
        }

        setImagesLoaded(false);
        setImageError(false);
        let loadedCount = 0;
        const totalImages = currentProduct.images.length;

        const timeout = setTimeout(() => {
          console.log("Image preload timeout for", currentProduct.name);
          setImageError(true);
          setImagesLoaded(false);
        }, 10000);
        setImageLoadTimeout(timeout);

        currentProduct.images.forEach((src: string) => {
          if (!src) {
            console.log("Invalid image source:", src);
            loadedCount++;
            if (loadedCount === totalImages) {
              setImagesLoaded(true);
              clearTimeout(timeout);
            }
            return;
          }

          const img = new window.Image();
          img.src = src;
          img.onload = () => {
            console.log("Preloaded image:", src);
            loadedCount++;
            if (loadedCount === totalImages) {
              setImagesLoaded(true);
              clearTimeout(timeout);
            }
          };
          img.onerror = () => {
            console.log("Error preloading image:", src);
            loadedCount++;
            if (loadedCount === totalImages) {
              setImagesLoaded(true);
              setImageError(true);
              clearTimeout(timeout);
            }
          };
        });
      };

      preloadImages();
      return () => {
        if (imageLoadTimeout) clearTimeout(imageLoadTimeout);
      };
    }, [currentProduct]);

    useEffect(() => {
      if (showPreview) {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const modal = document.querySelector("[role='dialog']");
        if (modal) {
          const firstElement = focusableElements[0] as HTMLElement;
          firstElement?.focus();
        }
      }
    }, [showPreview]);

    const handleTouchStart = (e: React.TouchEvent) => {
      setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
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
      zoomIntro: {
        scale: isMobile ? [1.5, 1.2, 1] : [1.6, 1.2, 1],
        y: isMobile ? [20, -10, 0] : [40, -20, 0],
        rotateX: isMobile ? [8, -4, 0] : [12, -6, 0],
        rotateY: isMobile ? [-6, 3, 0] : [-10, 5, 0],
        opacity: [0, 1, 1],
        transition: {
          duration: ANIMATION_DURATION / 1000 * (isMobile ? 1.2 : 1.6),
          times: [0, 0.6, 1],
          ease: [0.25, 0.8, 0.25, 1],
        },
      },
      scrollDown: {
        scale: isMobile ? [1, 1.1, 0.9] : [1, 1.3, 0.9],
        y: isMobile ? [0, -80, 60] : [0, -150, 120],
        x: isMobile ? [0, 30, -50] : [0, 60, -100],
        rotate: isMobile ? [0, -8, 4] : [0, -12, 8],
        opacity: [1, 0.95, 0],
        filter: isMobile
          ? ["blur(0px)", "blur(1px)", "blur(2px)"]
          : ["blur(0px) brightness(1)", "blur(2px) brightness(1.2)", "blur(3px) brightness(0.8)"],
        transition: {
          duration: ANIMATION_DURATION / 1000,
          times: [0, 0.5, 1],
          ease: [0.25, 0.8, 0.25, 1],
        },
      },
      scrollUp: {
        scale: isMobile ? [0.9, 1.1, 1] : [0.9, 1.3, 1],
        y: isMobile ? [60, -80, 0] : [120, -150, 0],
        x: isMobile ? [-50, 30, 0] : [-100, 60, 0],
        rotate: isMobile ? [4, -8, 0] : [8, -12, 0],
        opacity: [0, 0.95, 1],
        filter: isMobile
          ? ["blur(2px)", "blur(1px)", "blur(0px)"]
          : ["blur(3px) brightness(0.8)", "blur(2px) brightness(1.2)", "blur(0px) brightness(1)"],
        transition: {
          duration: ANIMATION_DURATION / 1000,
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
        filter: isMobile ? "blur(0px)" : "blur(0px) brightness(1)",
      },
    };

    const getImageAnimation = () => {
      if (isAnimating && scrollDirection === "down" && activeSection === "hero") {
        return { variants: scrollImageVariants, animate: "scrollDown" };
      } else if (isAnimating && scrollDirection === "up" && activeSection === "airmax") {
        return { variants: scrollImageVariants, animate: "scrollUp" };
      } else {
        return {
          variants: isNavClick ? navImageVariants : imageVariants,
          animate: "animate",
          transition: isNavClick
            ? {
                duration: ANIMATION_DURATION / 1000 * 0.7,
                ease: [0.4, 0, 0.2, 1],
                scale: { duration: ANIMATION_DURATION / 1000 * 0.5, ease: [0.34, 1.56, 0.64, 1] },
              }
            : { duration: ANIMATION_DURATION / 1000 * 0.6, ease: "easeInOut" },
        };
      }
    };

    const imageAnimation = getImageAnimation();

    const handleImageClick = () => {
      console.log("Image clicked, showPreview:", showPreview);
      onImageClick();
      setTimeout(() => onScrollDown(), ANIMATION_DURATION);
    };

    return (
      <>
        <motion.section
          ref={ref}
          className={cn(
            "min-h-screen flex items-center justify-center relative overflow-hidden",
            "pt-8 lg:pt-0 text-white px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900/90 to-transparent"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: ANIMATION_DURATION / 1000 * 0.8, ease: "easeOut" }}
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
                  transition={{ delay: 0.3, duration: ANIMATION_DURATION / 1000 * 0.6 }}
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
                  transition={{ delay: 0.5, duration: ANIMATION_DURATION / 1000 * 0.6 }}
                >
                  {(Object.keys(productData) as ProductColor[])
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

                  <div className="relative w-full max-w-[90vw]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${selectedProduct}-${currentImageIndex}`}
                        variants={{
                          initial: { opacity: 0, x: 50 },
                          animate: { opacity: 1, x: 0 },
                          exit: { opacity: 0, x: -50 },
                        }}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 250, damping: 25 }}
                        className="relative z-10 cursor-pointer will-change-transform will-change-opacity"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onClick={handleImageClick}
                      >
                        {imageError ? (
                          <div className="flex flex-col items-center justify-center h-[80vh] text-red-500">
                            <p>Failed to load image</p>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setImageError(false);
                                setImagesLoaded(false);
                                const timeout = setTimeout(() => setImageError(true), 10000);
                                setImageLoadTimeout(timeout);
                                currentProduct.images.forEach((src: string) => {
                                  const img = new window.Image();
                                  img.src = src;
                                  img.onload = () => clearTimeout(timeout);
                                });
                              }}
                            >
                              Retry
                            </Button>
                          </div>
                        ) : !imagesLoaded ? (
                          <div className="flex items-center justify-center h-[80vh]">
                            <div className="animate-spin h-8 w-8 border-4 border-t-white border-gray-600 rounded-full" />
                          </div>
                        ) : (
                          <Image
                            src={imageSrc}
                            alt={currentProduct.name}
                            width={600}
                            height={500}
                            sizes="90vw"
                            className="object-contain w-full h-auto max-h-[80vh]"
                            priority
                            onLoad={() => {
                              console.log("Main image loaded:", imageSrc);
                              setImagesLoaded(true);
                            }}
                            onError={() => {
                              console.log("Main image error:", imageSrc);
                              setImageError(true);
                            }}
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
                  transition={{ delay: 0.7, duration: ANIMATION_DURATION / 1000 * 0.6 }}
                >
                  {currentProduct.images.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => onImageIndexChange(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? "bg-white scale-125" : "bg-gray-600"
                      }`}
                      aria-label={`Select image ${index + 1}`}
                    />
                  ))}
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: ANIMATION_DURATION / 1000 * 0.6 }}
                >
                  <span className="text-lg sm:text-xl font-playfair font-semibold text-white">
                    {currentProduct.name}
                  </span>
                </motion.div>

                <motion.button
                  className="relative flex items-center justify-center gap-3 w-full max-w-[360px] mx-auto px-6 py-4 rounded-xl font-semibold text-base sm:text-lg text-white bg-gradient-to-r from-gray-900 to-gray-700 border-0 shadow-lg active:scale-95 transition-all duration-300 group overflow-hidden mt-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: ANIMATION_DURATION / 1000 * 0.6 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onScrollDown}
                  aria-label="Discover more about this product"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <ShoppingCart className="w-5 sm:w-6 h-5 sm:h-6 transition-transform group-hover:scale-110" />
                  <span className="font-semibold tracking-wide">Discover More</span>
                </motion.button>

                <motion.div
                  className="flex gap-3 justify-center mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: ANIMATION_DURATION / 1000 * 0.6 }}
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
                  transition={{ delay: 0.3, duration: ANIMATION_DURATION / 1000 * 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.h1
                    className="text-4xl font-light leading-tight"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ delay: 0.5, duration: ANIMATION_DURATION / 1000 * 0.8, scale: { duration: 0.2 } }}
                  >
                    <motion.span
                      className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-playfair font-semibold"
                      whileHover={{ backgroundPosition: "100% 50%" }}
                      style={{ backgroundSize: "200% 100%", backgroundPosition: "0% 50%", transition: "background-position 0.5s ease" }}
                    >
                      Wear your Style
                    </motion.span>
                    <motion.span
                      className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-playfair font-semibold"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: ANIMATION_DURATION / 1000 * 0.6 }}
                    >
                      with comfort.
                    </motion.span>
                  </motion.h1>
                </motion.div>

                <div className="relative flex-1 flex justify-center items-center overflow-hidden max-w-[90vw] mx-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsNavClick(true);
                      onPrevImage();
                    }}
                    className="absolute left-2 z-20 text-white border-2 border-white/40 rounded-full hover:bg-white/20 backdrop-blur-sm h-12 w-12 transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <div className="relative w-full max-w-[90vw] h-[80vh] flex justify-center items-center" style={{ perspective: "1500px" }}>
                    <AnimatePresence mode={isNavClick ? "sync" : "wait"}>
                      <motion.div
                        key={`${selectedProduct}-${currentImageIndex}`}
                        variants={imageAnimation.variants}
                        initial="initial"
                        animate={imageAnimation.animate}
                        exit="exit"
                        transition={imageAnimation.transition}
                        className={isNavClick ? "absolute inset-0 flex items-center justify-center" : "relative z-10 cursor-pointer"}
                        style={{ transformStyle: "preserve-3d" }}
                        whileHover={{ scale: 1.05 }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onClick={handleImageClick}
                      >
                        {imageError ? (
                          <div className="flex flex-col items-center justify-center h-[80vh] text-red-500">
                            <p>Failed to load image</p>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setImageError(false);
                                setImagesLoaded(false);
                                const timeout = setTimeout(() => setImageError(true), 10000);
                                setImageLoadTimeout(timeout);
                                currentProduct.images.forEach((src: string) => {
                                  const img = new window.Image();
                                  img.src = src;
                                  img.onload = () => clearTimeout(timeout);
                                });
                              }}
                            >
                              Retry
                            </Button>
                          </div>
                        ) : !imagesLoaded ? (
                          <div className="flex items-center justify-center h-[80vh]">
                            <div className="animate-spin h-8 w-8 border-4 border-t-white border-gray-600 rounded-full" />
                          </div>
                        ) : (
                          <Image
                            src={imageSrc}
                            alt={currentProduct.name}
                            width={1600}
                            height={1200}
                            sizes="90vw"
                            className="object-contain w-full h-auto max-h-[80vh] cursor-pointer"
                            priority
                            onLoad={() => {
                              console.log("Main image loaded:", imageSrc);
                              setImagesLoaded(true);
                            }}
                            onError={() => {
                              console.log("Main image error:", imageSrc);
                              setImageError(true);
                            }}
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
                    className="absolute right-2 z-20 text-white border-2 border-white/40 rounded-full hover:bg-white/20 backdrop-blur-sm h-12 w-12 transition-all hover:scale-110"
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
                  {(Object.keys(productData) as ProductColor[])
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
                        whileHover={{ scale: 1.15, y: -5, boxShadow: "0 8px 20px rgba(255,255,255,0.15)" }}
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

              {/* Desktop Footer */}
              <div className="hidden lg:flex flex-col lg:flex-row justify-between items-center mb-2 gap-6">
                <motion.button
                  className="relative flex items-center justify-center gap-3 w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-4 rounded-xl font-semibold text-base sm:text-lg text-white bg-gradient-to-r from-gray-900 to-gray-700 shadow-gray-900/25 border-0 hover:shadow-xl hover:shadow-purple-500/40 hover:from-purple-700 hover:to-blue-600 active:scale-95 transition-all duration-300 group overflow-hidden"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1, duration: ANIMATION_DURATION / 1000 * 0.6 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onScrollDown}
                  aria-label="Discover more about this product"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <ShoppingCart className="w-5 sm:w-6 h-5 sm:h-6 transition-transform group-hover:scale-110" />
                  <span className="font-semibold tracking-wide">Add to cart</span>
                </motion.button>

                <motion.div
                  className="flex gap-2 items-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
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

                <div></div>
              </div>
            </div>
          </div>
        </motion.section>
        <AnimatePresence>
          {showPreview && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                console.log("Modal background clicked, closing");
                onImageClick();
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Product image preview"
            >
              <motion.div
                className="relative"
                initial={{ scale: 0.9, rotateX: 15, opacity: 0 }}
                animate={{ scale: 1.1, rotateX: 0, opacity: 1 }}
                exit={{ scale: 0.9, rotateX: -15, opacity: 0 }}
                transition={{ duration: ANIMATION_DURATION / 1000, ease: [0.25, 0.8, 0.25, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"
                  onClick={() => {
                    console.log("Close button clicked");
                    onImageClick();
                  }}
                  aria-label="Close preview"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {imageError ? (
                  <div className="flex flex-col items-center justify-center h-[90vh] w-[75vw] text-red-500">
                    <p>Failed to load image</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        console.log("Retry button clicked for modal image");
                        setImageError(false);
                        setImagesLoaded(false);
                        const timeout = setTimeout(() => setImageError(true), 10000);
                        setImageLoadTimeout(timeout);
                        currentProduct.images.forEach((src: string) => {
                          const img = new window.Image();
                          img.src = src;
                          img.onload = () => clearTimeout(timeout);
                        });
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                ) : !imagesLoaded ? (
                  <div className="flex items-center justify-center h-[90vh] w-[75vw]">
                    <div className="animate-spin h-8 w-8 border-4 border-t-white border-gray-600 rounded-full" />
                  </div>
                ) : (
                  <Image
                    src={imageSrc}
                    alt={currentProduct.name}
                    width={1200}
                    height={1200}
                    sizes={isMobile ? "100vw" : "75vw"}
                    className={cn(
                      "object-contain",
                      isMobile ? "max-h-[90vh] w-auto" : "max-h-[90vh] max-w-[75vw] w-auto"
                    )}
                    priority
                    onLoad={() => {
                      console.log("Modal image loaded:", imageSrc);
                      setImagesLoaded(true);
                    }}
                    onError={() => {
                      console.log("Modal image error:", imageSrc);
                      setImageError(true);
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }
);

HeroSection.displayName = "HeroSection";

export default HeroSection;