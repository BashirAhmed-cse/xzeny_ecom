"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

type ProductColor = "black" | "red";

interface Product {
  name: string;
  images: string[];
  releaseDate: string;
  colorWay: string;
  features?: Array<{ text: string; emoji: string }>;
}

interface ColorTheme {
  bg: string;
  gradient: string;
  text: string;
}

interface ShoeCardProps {
  activeSection: "hero" | "airmax" | "shoecard";
  isAnimating: boolean;
  scrollDirection: "up" | "down";
  currentColorTheme: ColorTheme;
  productImage: string;
  currentProduct: Product;
  onScrollUp: () => void;
  setShowPreview?: (value: boolean) => void;
}

const ANIMATION_DURATION = 700; // ms, synced with Hero
const ANIMATION_DURATION_S = ANIMATION_DURATION / 1000;

const defaultFeatures = [
  { text: "Slip-resistant", emoji: "🔒", finalX: -320, finalY: -40, rotation: -5, delay: 0.1 },
  { text: "Lightweight", emoji: "⚡", finalX: 320, finalY: -60, rotation: 8, delay: 0.2 },
  { text: "Eco-friendly", emoji: "🌿", finalX: -400, finalY: 80, rotation: -8, delay: 0.3 },
  { text: "Quick-dry", emoji: "💨", finalX: 350, finalY: 60, rotation: 6, delay: 0.4 },
  { text: "Shock absorption", emoji: "🛡️", finalX: 340, finalY: 150, rotation: 12, delay: 0.5 },
  { text: "Durable", emoji: "🪡", finalX: -340, finalY: 150, rotation: -12, delay: 0.6 },
];

const ShoeCard: React.FC<ShoeCardProps> = ({
  activeSection,
  isAnimating,
  scrollDirection,
  currentColorTheme,
  productImage,
  currentProduct,
  onScrollUp,
  setShowPreview,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const isMobile = useMemo(() => typeof window !== "undefined" && window.innerWidth < 1024, []);
  const baseOffset = isMobile ? 100 : 320; // Responsive tag positions

  // Dynamic features or fallback
  const featureTags = (currentProduct.features || defaultFeatures).map((tag, i) => ({
    ...tag,
    finalX: i % 2 === 0 ? -baseOffset : baseOffset,
    finalY: tag.finalY || (i < 2 ? -60 : i < 4 ? 60 : 150),
    rotation: tag.rotation || (i % 2 === 0 ? -5 - i : 5 + i),
    delay: 0.1 + i * 0.1,
  }));

  // Memoized particle positions
  const particlePositions = useMemo(
    () =>
      [...Array(isMobile ? 4 : 8)].map((_, i) => ({
        x: Math.cos(i * 0.78) * (isMobile ? 50 : 100),
        y: Math.sin(i * 0.78) * (isMobile ? 50 : 100),
        delay: 0.5 + i * 0.1,
      })),
    [isMobile]
  );

  const imageVariants = {
    scrollDownEnter: {
      scale: 1,
      y: 0,
      x: 0,
      rotate: 0,
      opacity: 1,
      filter: "blur(0px) brightness(1)",
      transition: { 
        duration: ANIMATION_DURATION_S, 
        ease: [0.25, 0.8, 0.25, 1] 
      },
    },
    scrollUpExit: {
      scale: isMobile ? 0.95 : 0.9,
      y: isMobile ? 100 : 150,
      x: isMobile ? 80 : 120,
      rotate: -10,
      opacity: 0,
      filter: "blur(3px) brightness(0.7)",
      transition: { 
        duration: ANIMATION_DURATION_S, 
        ease: [0.25, 0.8, 0.25, 1] 
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
      rotate: -2,
      transition: { duration: 0.3 },
    },
  };

  const tagContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      }
    }
  };

  const tagVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.3, 
      x: 0, 
      y: 0,
      transition: { duration: 0.3 }
    },
    visible: (config: { delay: number; finalX: number; finalY: number; rotation: number }) => ({
      opacity: 1,
      scale: 1,
      x: config.finalX,
      y: config.finalY,
      rotate: config.rotation,
      transition: { 
        duration: 0.8, 
        delay: config.delay, 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      },
    }),
    exit: {
      opacity: 0,
      scale: 0.3,
      x: 0,
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: {
      scale: 1.15,
      y: (config: { finalY: number }) => config.finalY - 8,
      backgroundColor: "rgba(255,255,255,0.95)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
      transition: { duration: 0.3 },
    },
    tap: { 
      scale: 0.9, 
      transition: { duration: 0.1 } 
    },
  };

  const backgroundVariants = {
    hidden: { scale: 0.6, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 0.08, 
      transition: { duration: 1.5, ease: "easeOut" } 
    },
  };

  const handleImageClick = () => {
    setShowPreview?.(true);
    setTimeout(() => onScrollUp(), ANIMATION_DURATION);
  };

  const handleImageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleImageClick();
    }
  };

  const imageSrc = imageError ? "/images/fallback-shoe.png" : productImage;

  // Determine animation states
  const isEnteringShoeCard = isAnimating && scrollDirection === "down" && activeSection === "shoecard";
  const isExitingToAirmax = isAnimating && scrollDirection === "up" && activeSection === "airmax";
  const isActive = activeSection === "shoecard";

  return (
    <motion.div
      className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden"
      style={{ backgroundColor: currentColorTheme.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-label={`Shoe card for ${currentProduct.name}`}
    >
      {/* Scroll Up Button */}
      <motion.button
        onClick={onScrollUp}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 text-white/85 hover:text-white backdrop-blur-md bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full border border-white/25 transition-all duration-300"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        aria-label="Scroll up to AirMax section"
      >
        <div className="flex items-center gap-2">
          <ArrowUp className="w-4 h-4" aria-hidden="true" />
          <span className="text-xs font-medium">Back to AirMax</span>
        </div>
      </motion.button>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ willChange: "transform" }}>
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 180 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-white/20 to-white/10 rounded-full blur-2xl sm:blur-3xl"
        />
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 2, delay: 0.7 }}
          className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-white/10 to-white/20 rounded-full blur-2xl sm:blur-3xl"
        />
      </div>

      {/* Nike Swoosh Background */}
      <motion.div
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 flex items-center justify-center"
      >
        <Image
          src="/logo.png"
          alt="Nike Swoosh background"
          width={1000}
          height={1000}
          sizes="(max-width: 640px) 80vw, 600px"
          className="object-contain w-[80%] sm:w-full max-w-[600px] opacity-20"
        />
      </motion.div>

      <div className="relative w-full max-w-6xl">
        {/* Shoe Container */}
        <motion.div
          variants={imageVariants}
          initial="normal"
          animate={
            isEnteringShoeCard
              ? "scrollDownEnter"
              : isExitingToAirmax
              ? "scrollUpExit"
              : "normal"
          }
          whileHover="hover"
          className="flex justify-center relative z-10 cursor-pointer mb-8 sm:mb-0"
          tabIndex={0}
          onClick={handleImageClick}
          onKeyDown={handleImageKeyDown}
          role="button"
          aria-label={`View ${currentProduct.name} details or scroll up`}
          style={{ willChange: "transform, opacity, filter" }}
        >
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 blur-xl rounded-full scale-110"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />

          <div className="relative w-full max-w-[clamp(300px,50vw,600px)] h-[600px] flex items-center justify-center">
            <Image
              src={imageSrc}
              alt={currentProduct.name}
              width={800}
              height={800}
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 600px"
              className="object-contain drop-shadow-2xl relative z-20 w-full max-h-full"
              onLoad={() => setImagesLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>

          {/* Floating Feature Tags */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center" 
            role="list"
            variants={tagContainerVariants}
            initial="hidden"
            animate={isActive ? "visible" : "exit"}
          >
            {featureTags.map((tag, i) => (
              <motion.div
                key={i}
                custom={tag}
                variants={tagVariants}
                initial="hidden"
                animate={isActive ? "visible" : "exit"}
                whileHover="hover"
                whileTap="tap"
                className="absolute bg-white/90 backdrop-blur-sm border border-white/60 shadow-2xl px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-sm font-medium flex items-center gap-2 cursor-pointer whitespace-nowrap z-30"
                style={{ transformOrigin: "center center" }}
                tabIndex={0}
                role="listitem"
                aria-label={tag.text}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.focus();
                }}
              >
                <span className="text-lg sm:text-xl" aria-hidden="true">
                  {tag.emoji}
                </span>
                <span className="text-gray-800 font-semibold">{tag.text}</span>
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 0.4 }}
                  transition={{ delay: tag.delay + 0.4, duration: 0.6 }}
                  className="absolute w-8 sm:w-12 h-0.5 bg-gray-500 -left-8 sm:-left-12 top-1/2 transform -translate-y-1/2 origin-right"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Floating Particles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.8 }}
            className="absolute inset-0 pointer-events-none"
          >
            {particlePositions.map((pos, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                animate={{ 
                  scale: isActive ? 1 : 0, 
                  x: isActive ? pos.x : 0, 
                  y: isActive ? pos.y : 0, 
                  opacity: isActive ? 0.6 : 0 
                }}
                transition={{ duration: 1.5, delay: isActive ? pos.delay : 0 }}
                className="absolute w-1 h-1 bg-white rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Heading and CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mt-4 sm:mt-10">
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: isActive ? 1 : 0 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl text-center hover:bg-gray-100 transition-all duration-300"
            onClick={() => {/* Add collection navigation logic */ }}
            aria-label="Explore the collection"
          >
            Explore Collection →
          </motion.button>

          <motion.div
            initial={{ x: 100, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9 }}
            transition={{ duration: 1, delay: 0.8, type: "spring" }}
            className="text-center sm:text-right w-full sm:w-auto"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Quality
              </span>
              <br />
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                that speaks.
              </span>
            </h1>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShoeCard;