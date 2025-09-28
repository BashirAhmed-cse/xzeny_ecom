"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ShoppingCart, Sparkles, Zap, Shield } from "lucide-react";
import { Button } from "./ui/button";

type ProductColor = "black" | "red";

interface Product {
  name: string;
  images: string[];
  releaseDate: string;
  colorWay: string;
  features: string[];
  price: string;
}

const Hero: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductColor>("black");
  const [selectedColor, setSelectedColor] = useState<ProductColor>("black");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // ✅ Enhanced background theme with gradients
  const colorThemes: Record<ProductColor, { gradient: string; accent: string }> = {
    black: {
      gradient: "linear-gradient(135deg, #000102 0%, #1a1a2e 50%, #16213e 100%)",
      accent: "#6366f1"
    },
    red: {
      gradient: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 30%, #dc2626 100%)",
      accent: "#ef4444"
    },
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
      features: ["Air Cushioning", "Lightweight", "Durable"],
      price: "$149.99"
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
      features: ["Premium Leather", "Enhanced Grip", "Breathable"],
      price: "$159.99"
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

  // Enhanced animation variants
  const imageVariants = {
    initial: { 
      x: "50%", 
      opacity: 0, 
      scale: 0.8, 
      filter: "blur(12px)",
      rotateY: -30 
    },
    animate: { 
      x: 0, 
      opacity: 1, 
      scale: 1, 
      filter: "blur(0px)",
      rotateY: 0 
    },
    exit: { 
      x: "-50%", 
      opacity: 0, 
      scale: 0.8, 
      filter: "blur(12px)",
      rotateY: 30 
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: { duration: 0.3 }
    }
  };

  const floatingVariants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
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
      {/* ✅ Enhanced Animated Background */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          background: colorThemes[selectedColor].gradient,
        }}
      />

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0 
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto mt-12 lg:mt-14">
        <div className="w-full">
          {/* Mobile: Enhanced Vertical Layout */}
          <div className="lg:hidden flex flex-col gap-6">
            {/* Enhanced Title - Mobile */}
            <motion.div
              className="text-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.h1
                className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-2"
                whileInView={{ scale: [0.9, 1] }}
                transition={{ duration: 0.5 }}
              >
                Wear Your Style
              </motion.h1>
              <p className="text-lg text-gray-200 font-light">With Ultimate Comfort</p>
              
              {/* Price Tag */}
              <motion.div
                className="mt-3 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-white">{currentProduct.price}</span>
              </motion.div>
            </motion.div>

            {/* Enhanced Product Thumbnails */}
            <motion.div
              className="flex justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {(Object.entries(productData) as [ProductColor, Product][]).map(
                ([key, product]) => (
                  <motion.button
                    key={key}
                    onClick={() => {
                      setSelectedProduct(key);
                      setSelectedColor(key);
                      setCurrentImageIndex(0);
                    }}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedProduct === key
                        ? "border-white scale-110 shadow-2xl shadow-white/30"
                        : "border-gray-500 hover:border-white"
                    } group`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-${key === 'black' ? 'blue' : 'red'}-500/20 to-transparent`} />
                  </motion.button>
                )
              )}
            </motion.div>

            {/* Enhanced Main Image Section */}
            <div className="relative flex justify-center items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="absolute left-2 z-20 text-white bg-black/30 border border-white/20 rounded-full hover:bg-white/20 backdrop-blur-sm h-12 w-12 shadow-lg"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <div className="relative w-full max-w-[400px]">
                {/* Enhanced Background Effect */}
                <motion.div
                  variants={floatingVariants}
                  animate="float"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl scale-110"
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedProduct}-${currentImageIndex}`}
                    variants={imageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover="hover"
                    transition={{ duration: 0.5, ease: "easeInOut" }}
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
                      className="object-contain w-full h-auto drop-shadow-2xl"
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
                className="absolute right-2 z-20 text-white bg-black/30 border border-white/20 rounded-full hover:bg-white/20 backdrop-blur-sm h-12 w-12 shadow-lg"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Enhanced Image Indicators */}
            <motion.div
              className="flex gap-3 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              {currentProduct.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white scale-125 shadow-lg shadow-white/50"
                      : "bg-gray-500 hover:bg-gray-300"
                  }`}
                />
              ))}
            </motion.div>

            {/* Enhanced Product Info */}
            <motion.div
              className="text-center space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white">
                {currentProduct.name}
              </h2>
              
              {/* Features */}
              <div className="flex justify-center gap-4 flex-wrap">
                {currentProduct.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center gap-1 text-sm text-gray-200 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full"
                  >
                    <Zap className="w-3 h-3 text-yellow-400" />
                    {feature}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced CTA Button */}
            <motion.button
              className="relative flex items-center justify-center gap-3 
                         w-full px-8 py-4 
                         rounded-2xl font-bold text-lg 
                         text-white bg-gradient-to-r from-gray-900 to-gray-800 
                         border-0 shadow-2xl
                         active:scale-95 transition-all duration-300
                         group overflow-hidden mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              whileHover={{ 
                scale: 1.02,
                background: `linear-gradient(45deg, ${colorThemes[selectedColor].accent}, #8b5cf6)`
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Enhanced Shine effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                              -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] 
                              transition-transform duration-1000"
              />
              
              <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110 group-hover:rotate-12" />
              <span className="font-bold tracking-wider">Add to Cart • {currentProduct.price}</span>
              
              {/* Pulse effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-white/30"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            {/* Enhanced Thumbnail Previews */}
            <motion.div
              className="flex gap-3 justify-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {currentProduct.images.map((img, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? "border-white scale-110 shadow-xl shadow-white/30"
                      : "border-gray-600 hover:border-white"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover transition-transform hover:scale-110"
                  />
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Desktop: Enhanced Layout */}
          <div className="hidden lg:flex flex-col-reverse lg:flex-row items-center justify-between gap-12 relative">
            {/* Enhanced Left Side */}
            <motion.div
              className="flex flex-col gap-8 items-start self-start flex-1"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.9 }}
            >
              <motion.div
                className="space-y-4"
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
              >
                <motion.h1
                  className="text-6xl font-bold leading-tight"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <motion.span
                    className="block bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
                    animate={isHovering ? { backgroundPosition: "100% 50%" } : {}}
                    style={{
                      backgroundSize: "200% 100%",
                      backgroundPosition: "0% 50%",
                    }}
                  >
                    Wear Your
                  </motion.span>
                  <motion.span
                    className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    Style
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="text-xl text-gray-300 font-light max-w-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Experience ultimate comfort with premium design that matches your lifestyle.
                </motion.p>

                {/* Features List */}
                <motion.div
                  className="space-y-3 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {currentProduct.features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      className="flex items-center gap-3 text-gray-200"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-current rounded-full" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Price */}
                <motion.div
                  className="flex items-center gap-4 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  <span className="text-3xl font-bold text-white">{currentProduct.price}</span>
                  <motion.span
                    className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.8 }}
                  >
                    In Stock
                  </motion.span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Enhanced Main Shoe Section */}
            <div className="relative flex-1 flex justify-center items-center max-w-2xl">
              <motion.div
                variants={floatingVariants}
                animate="float"
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl scale-110"
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="absolute left-4 z-20 text-white bg-black/30 border border-white/20 rounded-full hover:bg-white/20 backdrop-blur-sm h-14 w-14 shadow-xl"
              >
                <ChevronLeft className="h-7 w-7" />
              </Button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedProduct}-${currentImageIndex}`}
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover="hover"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="relative z-10"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <Image
                    src={imageSrc}
                    alt={currentProduct.name}
                    width={800}
                    height={700}
                    className="object-contain w-full h-auto max-h-[700px] drop-shadow-2xl"
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
                className="absolute right-4 z-20 text-white bg-black/30 border border-white/20 rounded-full hover:bg-white/20 backdrop-blur-sm h-14 w-14 shadow-xl"
              >
                <ChevronRight className="h-7 w-7" />
              </Button>
            </div>

            {/* Enhanced Thumbnails */}
            <motion.div
              className="flex flex-col gap-6 items-end self-start"
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
                    className={`relative w-32 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedProduct === key
                        ? "border-white scale-110 shadow-2xl shadow-white/30"
                        : "border-gray-600 hover:border-white"
                    } group`}
                    whileHover={{
                      scale: 1.15,
                      y: -5,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
                      {product.name}
                    </div>
                  </motion.button>
                )
              )}
            </motion.div>
          </div>
        </div>

        {/* Enhanced Desktop Footer */}
        <div className="hidden lg:flex flex-col lg:flex-row justify-between items-center mt-12 gap-8">
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <span className="text-3xl font-bold text-white">
              {currentProduct.name}
            </span>
            <span className="text-gray-300">{currentProduct.colorWay}</span>
          </motion.div>

          <motion.div
            className="flex gap-4 items-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            <div className="flex gap-3">
              {currentProduct.images.map((img, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? "border-white scale-105 shadow-xl shadow-white/30"
                      : "border-gray-600 hover:border-white"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover transition-transform hover:scale-110"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.button
            className="relative flex items-center justify-center gap-4 
                       px-12 py-5 
                       rounded-2xl font-bold text-lg 
                       text-white bg-gradient-to-r from-gray-900 to-gray-800
                       border-0 shadow-2xl
                       active:scale-95 transition-all duration-300
                       group overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            whileHover={{ 
              scale: 1.05,
              background: `linear-gradient(45deg, ${colorThemes[selectedColor].accent}, #8b5cf6)`
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                            -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] 
                            transition-transform duration-1000"
            />
            <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110 group-hover:rotate-12" />
            <span className="font-bold tracking-wider">Add to Cart • {currentProduct.price}</span>
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;