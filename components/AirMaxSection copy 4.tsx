"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUp, ArrowDown, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

type ProductColor = "black" | "red";

interface Product {
  name: string;
  images: string[];
  releaseDate: string;
  colorWay: string;
  features?: Array<{ icon: string; text: string }>;
  price?: string;
}

interface ColorTheme {
  bg: string;
  gradient: string;
  text: string;
}

interface AirMaxSectionProps {
  activeSection: "hero" | "airmax" | "shoecard";
  isAnimating: boolean;
  scrollDirection: "up" | "down";
  currentColorTheme: ColorTheme;
  productImage: string;
  currentProduct: Product;
  onScrollUp: () => void;
  onScrollDown: () => void;
  setShowPreview: (value: boolean) => void;
}

const ANIMATION_DURATION = 700;
const ANIMATION_DURATION_S = ANIMATION_DURATION / 1000;

const defaultFeatures = [
  { icon: "✨", text: "Max Air Cushioning" },
  { icon: "🌿", text: "Eco-Friendly Materials" },
  { icon: "⚡", text: "Ultra-Lightweight" },
  { icon: "🔄", text: "Full Flexibility" },
];

const AirMaxSection: React.FC<AirMaxSectionProps> = ({
  activeSection,
  isAnimating,
  scrollDirection,
  currentColorTheme,
  productImage,
  currentProduct,
  onScrollUp,
  onScrollDown,
  setShowPreview,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imageLoadTimeout, setImageLoadTimeout] = useState<NodeJS.Timeout | null>(null);

  const isMobile = useMemo(() => typeof window !== "undefined" && window.innerWidth < 1024, []);

  const particlePositions = useMemo(
    () =>
      [...Array(isMobile ? 4 : 12)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: Math.random() * 2 + 1.5,
        delay: Math.random() * 0.8,
        yOffset: Math.random() * 40 - 20,
        opacityRange: Math.random() * 0.3 + 0.2,
        scaleRange: Math.random() * 0.5 + 0.5,
      })),
    [isMobile]
  );

  const features = currentProduct.features || defaultFeatures;
  const price = currentProduct.price || "$149.99";

  useEffect(() => {
    const preloadImages = () => {
      if (!productImage) {
        console.log("No product image to preload");
        setImageError(true);
        return;
      }

      setImagesLoaded(false);
      setImageError(false);
      let loadedCount = 0;
      const totalImages = 1;

      const timeout = setTimeout(() => {
        console.log("Image preload timeout for AirMaxSection");
        setImageError(true);
        setImagesLoaded(false);
      }, 10000);
      setImageLoadTimeout(timeout);

      const img = new window.Image();
      img.src = productImage;
      img.onload = () => {
        console.log("Preloaded AirMax image:", productImage);
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
          clearTimeout(timeout);
        }
      };
      img.onerror = () => {
        console.log("Error preloading AirMax image:", productImage);
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
          setImageError(true);
          clearTimeout(timeout);
        }
      };
    };

    preloadImages();
    return () => {
      if (imageLoadTimeout) clearTimeout(imageLoadTimeout);
    };
  }, [productImage]);

  useEffect(() => {
    if (activeSection === "airmax") {
      setShowPreview(false);
    }
  }, [activeSection, setShowPreview]);

  const imageVariants = {
    scrollDownEnter: {
      scale: isMobile ? [0.8, 1.1, 1] : [0.9, 1.25, 1],
      y: isMobile ? [60, -50, 0] : [120, -150, 0],
      x: isMobile ? [-30, 20, 0] : [0, 0, 0],
      rotateX: isMobile ? [8, -4, 0] : [15, -8, 0],
      rotateY: isMobile ? [-6, 3, 0] : [-12, 6, 0],
      opacity: [0, 0.9, 1],
      filter: ["blur(4px) brightness(0.8)", "blur(2px) brightness(1.1)", "blur(0px) brightness(1)"],
      transition: {
        duration: ANIMATION_DURATION_S * 0.9,
        times: [0, 0.6, 1],
        ease: [0.25, 0.8, 0.25, 1],
      },
    },
    scrollUpExit: {
      scale: isMobile ? [1, 1.1, 0.8] : [1, 1.25, 0.9],
      y: isMobile ? [0, -50, 60] : [0, -150, 120],
      x: isMobile ? [0, -20, 30] : [0, 0, 0],
      rotateX: isMobile ? [0, 4, -8] : [0, 8, -15],
      rotateY: isMobile ? [0, -3, 6] : [0, -6, 12],
      opacity: [1, 0.9, 0],
      filter: ["blur(0px) brightness(1)", "blur(2px) brightness(1.1)", "blur(4px) brightness(0.8)"],
      transition: {
        duration: ANIMATION_DURATION_S * 0.9,
        times: [0, 0.6, 1],
        ease: [0.25, 0.8, 0.25, 1],
      },
    },
    normal: {
      scale: 1,
      y: 0,
      x: 0,
      rotateX: 0,
      rotateY: 0,
      opacity: 1,
      filter: "blur(0px) brightness(1)",
    },
    hover: {
      scale: isMobile ? 1.05 : 1.1,
      y: isMobile ? -5 : -10,
      rotateX: () => mousePos.y * (isMobile ? 5 : 10),
      rotateY: () => mousePos.x * (isMobile ? 5 : 10),
      translateZ: isMobile ? 10 : 50,
      filter: "blur(0px) brightness(1.1)",
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const getImageVariant = () => {
    if (isAnimating && scrollDirection === "down" && activeSection === "airmax") {
      return "scrollDownEnter";
    } else if (isAnimating && scrollDirection === "up" && activeSection === "airmax") {
      return "scrollUpEnter";
    } else if (isAnimating && scrollDirection === "down" && activeSection === "hero") {
      return "scrollDownExit";
    } else if (isAnimating && scrollDirection === "up" && activeSection === "shoecard") {
      return "scrollUpExit";
    }
    return "normal";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const imageSrc = imageError ? "/images/fallback-shoe.png" : productImage;

  return (
    <motion.section
      className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden"
      style={{ backgroundColor: currentColorTheme.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: activeSection === "airmax" ? 1 : 0.3 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      aria-label={`Air Max product details for ${currentProduct.name}`}
      role="region"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: isMobile ? 0.1 : 0.15 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className={`absolute top-1/3 -left-16 ${isMobile ? 'w-40 h-40' : 'w-80 h-80'} bg-white rounded-full blur-3xl`}
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: isMobile ? 0.1 : 0.15 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className={`absolute bottom-1/3 -right-16 ${isMobile ? 'w-40 h-40' : 'w-80 h-80'} bg-white rounded-full blur-3xl`}
        />
        {particlePositions.map((pos, i) => (
          <motion.div
            key={i}
            className={`absolute ${isMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'} bg-white/20 rounded-full`}
            style={{ left: pos.left, top: pos.top }}
            animate={{
              y: [0, pos.yOffset, 0],
              opacity: [0, pos.opacityRange, 0],
              scale: [0, pos.scaleRange, 0],
            }}
            transition={{
              duration: pos.duration,
              repeat: Infinity,
              delay: pos.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-30 flex ${isMobile ? "flex-row gap-2" : "gap-4"}`}>
        <motion.button
          onClick={onScrollUp}
          className={`text-white/85 hover:text-white backdrop-blur-md bg-white/20 hover:bg-white/30 rounded-full border border-white/25 transition-all duration-300 ${
            isMobile ? "px-3 py-2" : "px-5 py-2"
          }`}
          whileHover={{ scale: isMobile ? 1.05 : 1.15 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <ArrowUp className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
            <span className={`font-medium ${isMobile ? "text-xs" : "text-xs"}`}>
              {isMobile ? "Top" : "Back to top"}
            </span>
          </div>
        </motion.button>

        <motion.button
          onClick={onScrollDown}
          className={`text-white/85 hover:text-white backdrop-blur-md bg-white/20 hover:bg-white/30 rounded-full border border-white/25 transition-all duration-300 ${
            isMobile ? "px-3 py-2" : "px-5 py-2"
          }`}
          whileHover={{ scale: isMobile ? 1.05 : 1.15 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <ArrowDown className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
            <span className={`font-medium ${isMobile ? "text-xs" : "text-xs"}`}>
              {isMobile ? "Next" : "Next section"}
            </span>
          </div>
        </motion.button>
      </div>

      {/* Mobile Layout */}
      {isMobile ? (
        <div className="relative z-10 w-full h-full flex flex-col justify-between items-center pt-16 pb-6">
          {/* Big Image */}
          <motion.div
            className="relative flex justify-center items-center cursor-pointer group w-full flex-1 mb-2 min-h-[50vh]"
            variants={imageVariants}
            initial="normal"
            animate={getImageVariant()}
            whileHover="hover"
            onClick={onScrollDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: "1200px" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
              initial={{ scale: 1.2, y: -100, opacity: 0 }}
              animate={{
                scale: 1,
                y: 0,
                opacity: 1,
                transition: { duration: 0.8, ease: [0.25, 0.8, 0.25, 1] },
              }}
              style={{ perspective: "1200px" }}
            />
            <div className="relative w-full h-full flex items-center justify-center">
              {!imagesLoaded ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin h-8 w-8 border-4 border-t-white border-gray-600 rounded-full" />
                </div>
              ) : imageError ? (
                <div className="flex items-center justify-center h-full text-red-500">
                  Failed to load image
                </div>
              ) : (
                <Image
                  src={imageSrc}
                  alt={currentProduct.name}
                  width={1200}
                  height={900}
                  sizes="100vw"
                  className="object-contain drop-shadow-2xl transition-all duration-300"
                  style={{ 
                    maxHeight: '60vh',
                    maxWidth: '95vw'
                  }}
                  priority
                  onLoad={() => setImagesLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-3 text-white text-center w-full max-w-md mx-auto px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-gray-300 font-medium block">
                Next-Gen Design • {currentProduct.releaseDate}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {currentProduct.name}
                </span>
              </h1>
            </div>

            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed px-2">
              Revolutionary Air unit for ultimate cushioning. Crafted for style and comfort. 
              <span className="block mt-1 text-amber-300 font-medium">
                Colorway: {currentProduct.colorWay}
              </span>
            </p>

            <motion.div
              className="grid grid-cols-2 gap-2 mt-3"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
              initial="hidden"
              animate="visible"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { y: 15, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                  className="flex items-center justify-center gap-1.5 text-white bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/15 transition-all duration-200"
                >
                  <span className="text-sm">{feature.icon}</span>
                  <span className="text-xs font-medium whitespace-nowrap">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex justify-center mt-4">
              <Button
                className="bg-white text-black hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl rounded-full w-full max-w-xs py-3"
                onClick={() => {/* Add cart logic */ }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                <span className="text-sm font-semibold">Buy Now • {price}</span>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="text-white/70 text-xs flex items-center gap-1 mt-3"
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ArrowDown className="w-3 h-3" />
            <span>Scroll for more</span>
          </motion.div>
        </div>
      ) : (
        /* Desktop Layout - Image in middle, content on sides */
        <div className="relative z-10 w-full max-w-8xl mx-auto h-full flex flex-col justify-center items-center">
          {/* Main Content Container */}
          <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Side - Product Info */}
            <motion.div
              className="lg:w-1/3 space-y-6 text-white"
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="space-y-3">
                <span className="text-sm uppercase tracking-widest text-gray-300 font-medium">
                  Next-Gen Design • {currentProduct.releaseDate}
                </span>
                <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight">
                  <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {currentProduct.name}
                  </span>
                </h1>
              </div>

              <p className="text-gray-200 text-lg leading-relaxed max-w-md">
                Revolutionary Air unit for ultimate cushioning. Crafted for style and comfort.
              </p>

              <div className="text-amber-300 font-semibold text-lg">
                Colorway: {currentProduct.colorWay}
              </div>

              {/* Buy Button on Left */}
              <div className="pt-4">
                <Button
                  className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl"
                  onClick={() => {/* Add cart logic */ }}
                >
                  <ShoppingCart className="w-6 h-6 mr-3" />
                  Buy Now • {price}
                </Button>
              </div>
            </motion.div>

            {/* Center - Large Image */}
            <motion.div
              className="lg:w-1/3 relative flex justify-center items-center cursor-pointer group"
              variants={imageVariants}
              initial="normal"
              animate={getImageVariant()}
              whileHover="hover"
              onClick={onScrollDown}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ perspective: "1600px" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
                initial={{ scale: 1.2, y: -100, opacity: 0 }}
                animate={{
                  scale: 1,
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.8, ease: [0.25, 0.8, 0.25, 1] },
                }}
                style={{ perspective: "1600px" }}
              />
              <div className="relative w-full h-[70vh] flex items-center justify-center">
                {!imagesLoaded ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin h-12 w-12 border-4 border-t-white border-gray-600 rounded-full" />
                  </div>
                ) : imageError ? (
                  <div className="flex items-center justify-center h-full text-red-500 text-lg">
                    Failed to load image
                  </div>
                ) : (
                  <Image
                    src={imageSrc}
                    alt={currentProduct.name}
                    width={1800}
                    height={1350}
                    sizes="50vw"
                    className="object-contain drop-shadow-2xl transition-all duration-300 group-hover:drop-shadow-[0_40px_40px_rgba(0,0,0,0.6)]"
                    style={{ 
                      maxHeight: '70vh',
                      maxWidth: '100%'
                    }}
                    priority
                    onLoad={() => setImagesLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            </motion.div>

            {/* Right Side - Features */}
            <motion.div
              className="lg:w-1/3 space-y-6"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.div
                className="grid grid-cols-1 gap-4"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
                }}
                initial="hidden"
                animate="visible"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { y: 30, opacity: 0 },
                      visible: { y: 0, opacity: 1 },
                    }}
                    className="flex items-center gap-4 text-white bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 hover:border-white/40 transition-all duration-300 group"
                    whileHover={{ 
                      scale: 1.05, 
                      backgroundColor: "rgba(255,255,255,0.15)",
                      boxShadow: "0 20px 40px rgba(255,255,255,0.1)"
                    }}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </span>
                    <span className="text-lg font-semibold">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div
                className="text-white/85 text-lg flex items-center gap-3 mt-8 justify-end"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="font-medium">Click image for next</span>
                <ArrowDown className="w-6 h-6 animate-pulse" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default AirMaxSection;