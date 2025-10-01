"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUp, ArrowDown, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

type ProductColor = "black" | "red"; // Expand as needed

interface Product {
  name: string;
  images: string[];
  releaseDate: string;
  colorWay: string;
  features?: Array<{ icon: string; text: string }>; // Optional dynamic features
  price?: string; // Optional dynamic price
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

const ANIMATION_DURATION = 700; // ms, synced with Hero component
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

  const isMobile = useMemo(() => typeof window !== "undefined" && window.innerWidth < 1024, []);

  // Memoize particle positions to prevent re-renders
  const particlePositions = useMemo(
    () =>
      [...Array(isMobile ? 6 : 12)].map(() => ({
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
    if (activeSection === "airmax") {
      setShowPreview(false);
    }
  }, [activeSection, setShowPreview]);

  const imageVariants = {
    scrollDownEnter: {
      scale: isMobile ? [0.9, 1.2, 1] : [0.9, 1.4, 1],
      y: isMobile ? [100, -150, 0] : [150, -200, 0],
      x: isMobile ? [-80, 60, 0] : [-120, 80, 0],
      rotate: isMobile ? [5, -10, 0] : [10, -15, 0],
      opacity: [0, 0.95, 1],
      filter: ["blur(3px) brightness(0.7)", "blur(2px) brightness(1.3)", "blur(0px) brightness(1)"],
      transition: {
        duration: ANIMATION_DURATION_S,
        times: [0, 0.5, 1],
        ease: [0.25, 0.8, 0.25, 1],
      },
    },
    scrollUpExit: {
      scale: isMobile ? [1, 1.2, 0.9] : [1, 1.4, 0.9],
      y: isMobile ? [0, -150, 100] : [0, -200, 150],
      x: isMobile ? [0, -60, 80] : [0, -80, 120],
      rotate: isMobile ? [0, 10, -5] : [0, 15, -10],
      opacity: [1, 0.95, 0],
      filter: ["blur(0px) brightness(1)", "blur(2px) brightness(1.3)", "blur(3px) brightness(0.7)"],
      transition: {
        duration: ANIMATION_DURATION_S,
        times: [0, 0.5, 1],
        ease: [0.25, 0.8, 0.25, 1],
      },
    },
    scrollDownExit: {
      scale: isMobile ? [1, 1.2, 0.9] : [1, 1.4, 0.9],
      y: isMobile ? [0, -150, 100] : [0, -200, 150],
      x: isMobile ? [0, 60, -80] : [0, 80, -120],
      rotate: isMobile ? [0, -10, 5] : [0, -15, 10],
      opacity: [1, 0.95, 0],
      filter: ["blur(0px) brightness(1)", "blur(2px) brightness(1.3)", "blur(3px) brightness(0.7)"],
      transition: {
        duration: ANIMATION_DURATION_S,
        times: [0, 0.5, 1],
        ease: [0.25, 0.8, 0.25, 1],
      },
    },
    scrollUpEnter: {
      scale: isMobile ? [0.9, 1.2, 1] : [0.9, 1.4, 1],
      y: isMobile ? [100, -150, 0] : [150, -200, 0],
      x: isMobile ? [80, -60, 0] : [120, -80, 0],
      rotate: isMobile ? [-5, 10, 0] : [-10, 15, 0],
      opacity: [0, 0.95, 1],
      filter: ["blur(3px) brightness(0.7)", "blur(2px) brightness(1.3)", "blur(0px) brightness(1)"],
      transition: {
        duration: ANIMATION_DURATION_S,
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
    hover: {
      scale: isMobile ? 1.05 : 1.1,
      y: -10,
      rotate: 2,
      filter: "blur(0px) brightness(1.15)",
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  // Helper to select image animation variant
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

  const handleImageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onScrollDown();
    }
  };

  // Fallback image
  const imageSrc = imageError ? "/images/fallback-shoe.png" : productImage;

  return (
    <motion.section
      className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden"
      style={{ backgroundColor: currentColorTheme.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: activeSection === "airmax" ? 1 : 0.3 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      aria-label={`Air Max product details for ${currentProduct.name}`}
      role="region"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ willChange: "transform" }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute top-1/3 -left-16 w-80 h-80 bg-white rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="absolute bottom-1/3 -right-16 w-80 h-80 bg-white rounded-full blur-3xl"
        />
        {particlePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/20 rounded-full"
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

      {/* Navigation Buttons - Stack on mobile */}
      <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex ${isMobile ? "flex-col" : "gap-4"}`}>
        <motion.button
          onClick={onScrollUp}
          className="text-white/85 hover:text-white backdrop-blur-md bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full border border-white/25 transition-all duration-300"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          aria-label="Scroll up to hero section"
        >
          <div className="flex items-center gap-2">
            <ArrowUp className="w-4 h-4" />
            <span className="text-xs font-medium">Back to top</span>
          </div>
        </motion.button>

        <motion.button
          onClick={onScrollDown}
          className="text-white/85 hover:text-white backdrop-blur-md bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full border border-white/25 transition-all duration-300"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          aria-label="Scroll down to shoe card section"
        >
          <div className="flex items-center gap-2">
            <ArrowDown className="w-4 h-4" />
            <span className="text-xs font-medium">Next section</span>
          </div>
        </motion.button>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-10">
        {/* Content */}
        <motion.div
          className="space-y-5 text-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div>
            <span className="text-xs uppercase tracking-widest text-gray-300 font-medium">
              Next-Gen Design • {currentProduct.releaseDate}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mt-2">
              <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {currentProduct.name}
              </span>
            </h1>
          </div>

          <p className="text-gray-200 text-base sm:text-lg leading-relaxed max-w-md">
            Revolutionary Air unit for ultimate cushioning. Crafted for style and comfort. Colorway: {currentProduct.colorWay}
          </p>

          <motion.div
            className="grid grid-cols-2 gap-3 max-w-sm"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            initial="hidden"
            animate="visible"
            role="list"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                className="flex items-center gap-2.5 text-white bg-white/15 backdrop-blur-md rounded-lg p-2.5 border border-white/20 hover:border-white/35 transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(255,255,255,0.2)" }}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.focus(); // Simple focus for accessibility
                }}
                aria-label={feature.text}
              >
                <span className="text-lg" aria-hidden="true">
                  {feature.icon}
                </span>
                <span className="text-xs font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex gap-4">
            <Button
              className="bg-white text-black px-6 py-3 sm:px-8 sm:py-3.5 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => {/* Add cart logic here */ }}
              aria-label={`Buy ${currentProduct.name} for ${price}`}
            >
              <ShoppingCart className="w-5 h-5 mr-2" aria-hidden="true" />
              Buy Now • {price}
            </Button>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          className="relative flex justify-center items-center cursor-pointer group max-w-[800px] mx-auto"
          variants={imageVariants}
          initial="normal"
          animate={getImageVariant()}
          whileHover="hover"
          onClick={onScrollDown}
          tabIndex={0}
          onKeyDown={handleImageKeyDown}
          aria-label={`Click or press Enter to scroll to next section - ${currentProduct.name} image`}
          role="button"
          style={{ willChange: "transform, opacity, filter" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
            initial={{ scale: 1.2, y: -100, opacity: 0 }}
            animate={{
              scale: 1,
              y: 0,
              opacity: 1,
              rotateX: 0,
              rotateY: 0,
              transition: { duration: 0.8, ease: [0.25, 0.8, 0.25, 1] },
            }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ perspective: "1600px" }}
          />
          <div className="relative w-full h-[600px] flex items-center justify-center">
            {/* {!imagesLoaded ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin h-8 w-8 border-4 border-t-white border-gray-600 rounded-full" />
              </div>
            ) : imageError ? (
              <div className="flex items-center justify-center h-full text-red-500">
                Failed to load image
              </div>
            ) : ( */}
              <Image
                src={imageSrc}
                alt={currentProduct.name}
                width={900}
                height={700}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain drop-shadow-2xl transition-all duration-300 group-hover:drop-shadow-[0_30px_30px_rgba(0,0,0,0.5)] max-h-full"
                onLoad={() => setImagesLoaded(true)}
                onError={() => setImageError(true)}
              />
            {/* )} */}
          </div>
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white/85 text-sm flex items-center gap-2 backdrop-blur-md bg-white/20 px-4 py-2 rounded-full border border-white/25"
            animate={{
              y: [0, -6, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            aria-hidden="true"
          >
            <ArrowDown className="w-4 h-4 animate-pulse" />
            <span>Click for next section</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AirMaxSection;