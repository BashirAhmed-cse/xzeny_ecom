"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
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

const Hero: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductColor>("black");
  const [selectedColor, setSelectedColor] = useState<ProductColor>("black");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // ✅ background theme colors
  const colorThemes: Record<ProductColor, string> = {
    black: "#000102",
    red: "#7f1d1d",
  };

  const productData: Record<ProductColor, Product> = {
    black: {
      name: "JORDAN BLUE",
      images: [
        "/images/jordan-blue.png",
        "/images/jordan-blue2.png",
        "/images/jordan-green.png",
        "/images/jordan-green2.png",
      ],
      releaseDate: "2016-10-06",
      colorWay: "SAIL/STARFISH-BLACK",
    },
    red: {
      name: "JORDAN RED",
      images: [
        "/images/jordan-red.png",
        "/images/jordan-green2.png",
        "/images/jordan-green2.png",
        "/images/jordan-blue2.png",
      ],
      releaseDate: "2025-10-06",
      colorWay: "SAIL/SCARLET-RED",
    },
  };

  const currentProduct = productData[selectedProduct];
  const imageSrc = imageError
    ? "/images/fallback-shoe.png"
    : currentProduct.images[currentImageIndex];

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === currentProduct.images.length - 1 ? 0 : prev + 1
    );
    setImageError(false);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentProduct.images.length - 1 : prev - 1
    );
    setImageError(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentImageIndex, selectedProduct]);

  useEffect(() => {
    const preloadImages = () => {
      currentProduct.images.forEach((src) => {
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
    if (touchStart - touchEnd > 50) handleNext();
    if (touchStart - touchEnd < -50) handlePrev();
  };

  // Animation variants for main image
  const imageVariants = {
    initial: { x: "50%", opacity: 0, scale: 0.8, filter: "blur(8px)" },
    animate: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { x: "-50%", opacity: 0, scale: 0.8, filter: "blur(8px)" },
  };

  return (
    <motion.section
      className={cn(
        "min-h-screen flex items-center justify-center relative overflow-hidden",
        "pt-16 lg:pt-0 text-white px-4 sm:px-6 lg:px-8"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* ✅ Background color with animation */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ backgroundColor: colorThemes[selectedColor] }}
        animate={{ backgroundColor: colorThemes[selectedColor] }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto mt-12 lg:mt-14">
        <div className="w-full">
          {/* Mobile: Vertical Layout */}
          <div className="lg:hidden flex flex-col gap-6">
            {/* Title - Mobile */}
            <motion.div
              className="text-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-3xl font-playfair font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Wear your Style
              </h1>
              <p className="text-lg text-gray-200 mt-2">with comfort.</p>
            </motion.div>

            {/* Product Thumbnails - Mobile Horizontal */}
            <motion.div
              className="flex justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {(Object.entries(productData) as [ProductColor, Product][]).map(
                ([key, product]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedProduct(key);
                      setSelectedColor(key);
                      setCurrentImageIndex(0);
                    }}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedProduct === key
                        ? "border-white scale-110 shadow-lg shadow-white/20"
                        : "border-gray-600 hover:border-white"
                    }`}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={64}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </button>
                )
              )}
            </motion.div>

            {/* Main Image - Mobile */}
            <div className="relative flex justify-center items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="absolute left-2 z-20 text-white border-2 border-white/40 rounded-full hover:bg-white/20 backdrop-blur-sm h-10 w-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="relative w-full max-w-[400px]">
                <Image
                  src="/ellips.svg"
                  alt="Ellipse Background"
                  width={400}
                  height={350}
                  className="absolute object-contain opacity-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedProduct}-${currentImageIndex}`}
                    variants={imageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="relative z-10"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <Image
                      src={imageSrc}
                      alt={currentProduct.name}
                      width={400}
                      height={350}
                      className="object-contain w-full h-auto"
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
                onClick={handleNext}
                className="absolute right-2 z-20 text-white border-2 border-white/40 rounded-full hover:bg-white/20 backdrop-blur-sm h-10 w-10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Image Indicators - Mobile */}
            <motion.div
              className="flex gap-2 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              {currentProduct.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white scale-125"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </motion.div>

            {/* Product Name - Mobile */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <span className="text-xl font-playfair font-semibold text-white">
                {currentProduct.name}
              </span>
            </motion.div>

            {/* CTA Button - Mobile */}
            <motion.button
              className="relative flex items-center justify-center gap-3 
                         w-full px-6 py-4 
                         rounded-xl font-semibold text-lg 
                         text-white bg-gradient-to-r from-gray-900 to-gray-700 
                         border-0 shadow-lg
                         active:scale-95 transition-all duration-300
                         group overflow-hidden mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                              -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] 
                              transition-transform duration-1000" />
              
              <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
              <span className="font-semibold tracking-wide">Add to Cart</span>
            </motion.button>

            {/* Thumbnail Previews - Mobile */}
            <motion.div
              className="flex gap-3 justify-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {currentProduct.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? "border-white scale-105 shadow-md shadow-white/20"
                      : "border-gray-600"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </motion.div>
          </div>

          {/* Desktop: Original Layout */}
          <div className="hidden lg:flex flex-col-reverse lg:flex-row items-center justify-center gap-6 relative">
            {/* Left Side Title */}
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

            {/* Main Shoe Section */}
            <div className="relative flex-1 flex justify-center items-center overflow-hidden max-w-[800px] mx-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="text-white border-2 border-white/40 rounded-full hover:bg-white/20 backdrop-blur-sm h-12 w-12 transition-all hover:scale-110"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Image
                src="/ellips.svg"
                alt="Ellipse Background"
                width={700}
                height={650}
                className="absolute object-contain opacity-80 top-1/2 left-1/2 -translate-x-1/2 translate-y-1/3 z-0 mt-25"
              />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedProduct}-${currentImageIndex}`}
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="relative z-10"
                  whileHover={{ scale: 1.05 }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <Image
                    src={imageSrc}
                    alt={currentProduct.name}
                    width={800}
                    height={700}
                    className="object-contain w-full h-auto max-h-[700px] sm:max-h-[600px] md:max-h-[700px]"
                    priority
                    onLoad={() => setImagesLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                </motion.div>
              </AnimatePresence>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="text-white border-2 border-white/40 rounded-full hover:bg-white/20 backdrop-blur-sm h-12 w-12 transition-all hover:scale-110"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Thumbnails - Switch Product */}
            <motion.div
              className="flex flex-row lg:flex-col gap-4 items-start self-start"
              initial="initial"
              animate="animate"
            >
              {(Object.entries(productData) as [ProductColor, Product][]).map(
                ([key, product]) => (
                  <motion.button
                    key={key}
                    initial={{ scale: 0.8, opacity: 0, x: 20 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    onClick={() => {
                      setSelectedProduct(key);
                      setSelectedColor(key);
                      setCurrentImageIndex(0);
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
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  </motion.button>
                )
              )}
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
            className="flex gap-4 items-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.6,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            <div className="flex gap-2">
              {currentProduct.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? "border-white scale-105 shadow-md shadow-white/20"
                      : "border-gray-700 hover:border-white hover:scale-105"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover transition-transform hover:scale-110"
                  />
                </button>
              ))}
            </div>
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
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                            -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] 
                            transition-transform duration-1000" />
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
            <span className="font-semibold tracking-wide">Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;