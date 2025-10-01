"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUp, ZoomIn, Sparkles } from "lucide-react";

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

const ANIMATION_DURATION = 800;
const ANIMATION_DURATION_S = ANIMATION_DURATION / 1000;

const defaultFeatures = [
  { text: "Slip-resistant", emoji: "🔒" },
  { text: "Lightweight", emoji: "⚡" },
  { text: "Eco-friendly", emoji: "🌿" },
  { text: "Quick-dry", emoji: "💨" },
  { text: "Shock absorption", emoji: "🛡️" },
  { text: "Durable", emoji: "🪡" },
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const isMobile = useMemo(() => typeof window !== "undefined" && window.innerWidth < 1024, []);
  const baseOffset = isMobile ? 120 : 280;

  // Enhanced feature tags with center-to-sides animation
  const featureTags = useMemo(() => {
    const features = currentProduct.features || defaultFeatures;
    
    if (isMobile) {
      // Mobile: Stack tags horizontally in rows
      return features.map((tag, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const horizontalPositions = [-80, 0, 80];
        const verticalPositions = [60, 120, 180];
        
        return {
          ...tag,
          startX: 0,
          startY: 0,
          finalX: horizontalPositions[col],
          finalY: verticalPositions[row],
          rotation: col === 0 ? -5 : col === 2 ? 5 : 0,
          delay: 0.4 + i * 0.1,
        };
      });
    } else {
      // Desktop: Original side placement
      return features.map((tag, i) => {
        const isLeftSide = i < 3;
        const positionIndex = i % 3;
        const verticalPositions = [-100, 0, 100];
        
        return {
          ...tag,
          startX: 0,
          startY: 0,
          finalX: isLeftSide ? -baseOffset : baseOffset,
          finalY: verticalPositions[positionIndex],
          rotation: isLeftSide ? -8 : 8,
          delay: 0.4 + i * 0.15,
        };
      });
    }
  }, [currentProduct.features, baseOffset, isMobile]);

  // Enhanced particle system
  const particlePositions = useMemo(
    () =>
      [...Array(isMobile ? 12 : 24)].map((_, i) => ({
        x: Math.cos(i * 0.26) * (isMobile ? 80 : 160),
        y: Math.sin(i * 0.26) * (isMobile ? 80 : 160),
        size: Math.random() * 3 + 1,
        delay: 0.6 + i * 0.05,
        duration: 2 + Math.random() * 2,
      })),
    [isMobile]
  );

  // Enhanced image animations
  const imageVariants = {
    scrollDownEnter: {
      scale: isMobile ? [0.8, 1.15, 1] : [0.7, 1.25, 1],
      x: isMobile ? ["60vw", 30, 0] : ["100vw", 60, 0],
      y: isMobile ? [60, -20, 0] : [100, -30, 0],
      rotateX: isMobile ? [15, -8, 0] : [20, -10, 0],
      rotateY: isMobile ? [-12, 6, 0] : [-15, 8, 0],
      opacity: [0, 0.8, 1],
      filter: ["blur(12px) brightness(0.6)", "blur(4px) brightness(1.2)", "blur(0px) brightness(1)"],
      transition: { 
        duration: ANIMATION_DURATION_S * 1.3, 
        times: [0, 0.7, 1], 
        ease: [0.34, 1.56, 0.64, 1] 
      },
    },
    scrollUpExit: {
      scale: isMobile ? [1, 1.15, 0.8] : [1, 1.25, 0.7],
      x: isMobile ? [0, 30, -60] : [0, 60, -100],
      y: isMobile ? [0, -20, 60] : [0, -30, 100],
      rotateX: isMobile ? [0, 8, -15] : [0, 10, -20],
      rotateY: isMobile ? [0, -6, 12] : [0, -8, 15],
      opacity: [1, 0.8, 0],
      filter: ["blur(0px) brightness(1)", "blur(4px) brightness(1.2)", "blur(12px) brightness(0.6)"],
      transition: { 
        duration: ANIMATION_DURATION_S * 1.3, 
        times: [0, 0.7, 1], 
        ease: [0.34, 1.56, 0.64, 1] 
      },
    },
    normal: {
      scale: 1,
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      opacity: 1,
      filter: "blur(0px) brightness(1)",
    },
    hover: {
      scale: isMobile ? 1.05 : 1.08,
      y: -8,
      rotateX: () => mousePos.y * 12,
      rotateY: () => mousePos.x * 12,
      translateZ: isMobile ? 30 : 60,
      filter: "blur(0px) brightness(1.1) contrast(1.05)",
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
  };

  // Enhanced tag animations with center-to-sides movement
  const tagVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5, 
      x: 0, 
      y: 0,
      rotate: 0 
    },
    visible: (config: any) => ({
      opacity: 1,
      scale: 1,
      x: config.finalX,
      y: config.finalY,
      rotate: config.rotation,
      transition: { 
        duration: 1.4, 
        delay: config.delay, 
        type: "spring", 
        stiffness: 80, 
        damping: 10,
        x: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] },
        y: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }
      },
    }),
    hover: {
      scale: 1.2,
      y: (config: any) => config.finalY - 5,
      backgroundColor: "rgba(255,255,255,1)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.8)",
      color: "#000",
      transition: { duration: 0.25, ease: "easeOut" },
    },
    tap: { scale: 0.85, transition: { duration: 0.1 } },
  };

  const backgroundVariants = {
    hidden: { scale: 0.4, opacity: 0, rotate: -45 },
    visible: { 
      scale: 1.1, 
      opacity: 0.08, 
      rotate: 0,
      transition: { duration: 2.5, ease: "easeOut", delay: 0.3 } 
    },
  };

  const handleImageClick = () => {
    setShowPreview?.(true);
    setTimeout(() => onScrollUp(), ANIMATION_DURATION);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const imageSrc = imageError ? "/images/fallback-shoe.png" : productImage;

  return (
    <motion.div
      className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 overflow-hidden font-modern"
      style={{ backgroundColor: currentColorTheme.bg, fontFamily: "Inter, Poppins, sans-serif" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: activeSection === "shoecard" ? 1 : 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      role="region"
      aria-label={`Shoe card for ${currentProduct.name}`}
    >
      {/* Enhanced Scroll Up Button */}
      <motion.button
        onClick={onScrollUp}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 z-40 text-white/90 hover:text-white backdrop-blur-xl bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl border border-white/20 transition-all duration-300 shadow-2xl group"
        whileHover={{ 
          scale: 1.1, 
          y: -2,
          backgroundColor: "rgba(255,255,255,0.15)",
          boxShadow: "0 15px 30px rgba(255,255,255,0.2)" 
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        aria-label="Scroll up to AirMax section"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowUp className="w-5 h-5" aria-hidden="true" />
          </motion.div>
          <span className="text-sm font-semibold tracking-wide">Back to AirMax</span>
        </div>
      </motion.button>

      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{ scale: 1.8, rotate: 180, opacity: 0.4 }}
          transition={{ duration: 3, delay: 0.4, ease: "easeOut" }}
          className="absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-br from-white/40 to-white/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0, rotate: 135, opacity: 0 }}
          animate={{ scale: 2, rotate: 0, opacity: 0.3 }}
          transition={{ duration: 3, delay: 0.6, ease: "easeOut" }}
          className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-tl from-white/30 to-white/5 rounded-full blur-3xl"
        />
        
        {/* Animated Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ delay: 1 }}
          className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,white_25px),linear-gradient(transparent_24px,white_25px)] bg-[size:25px_25px]"
        />
      </div>

      {/* Nike Swoosh Background */}
      <motion.div
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <Image
          src="/logo.png"
          alt="Nike Swoosh background"
          width={1200}
          height={1200}
          sizes="(max-width: 640px) 90vw, 800px"
          className="object-contain w-[90%] sm:w-full max-w-[800px] opacity-20"
          priority
        />
      </motion.div>

      <div className="relative w-full max-w-8xl">
        {/* Enhanced Shoe Container */}
        <motion.div
          variants={imageVariants}
          initial="normal"
          animate={
            isAnimating && scrollDirection === "down" && activeSection === "shoecard"
              ? "scrollDownEnter"
              : isAnimating && scrollDirection === "up" && activeSection === "airmax"
              ? "scrollUpExit"
              : "normal"
          }
          whileHover="hover"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex justify-center relative z-10 cursor-pointer mb-8 sm:mb-12 group"
          style={{ perspective: "2000px", willChange: "transform, opacity, filter" }}
          onClick={handleImageClick}
          role="button"
          aria-label={`View ${currentProduct.name} details or scroll up`}
        >
          {/* Enhanced Glow Effects */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/40 to-white/15 blur-3xl rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 2.5, opacity: 0.5 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          />
          
          {/* Hover Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 blur-2xl rounded-full"
            animate={{ 
              opacity: isHovered ? 0.3 : 0,
              scale: isHovered ? 1.8 : 1.2
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Zoom Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 10 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              scale: isHovered ? 1 : 0.8,
              y: isHovered ? 0 : 10
            }}
            transition={{ duration: 0.3 }}
            className="absolute top-8 right-8 z-40 bg-black/60 text-white p-3 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <ZoomIn className="w-5 h-5" />
              <span className="text-sm font-medium">Click to zoom</span>
            </div>
          </motion.div>

          {/* Shoe Image Container */}
          <div className="relative w-full max-w-[70vw] h-[75vh] flex items-center justify-center">
            <Image
              src={imageSrc}
              alt={currentProduct.name}
              width={isMobile ? 1400 : 2000}
              height={isMobile ? 1050 : 1500}
              sizes="70vw"
              className="object-contain drop-shadow-2xl relative z-20 w-full max-h-[75vh]"
              priority
              onLoad={() => {
                console.log("ShoeCard image loaded:", imageSrc);
                setImagesLoaded(true);
              }}
              onError={() => {
                console.log("ShoeCard image error:", imageSrc);
                setImageError(true);
              }}
            />
          </div>

          {/* Enhanced Floating Particles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute inset-0 pointer-events-none"
          >
            {particlePositions.map((pos, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, pos.size * 0.4, 0], 
                  x: pos.x, 
                  y: pos.y, 
                  opacity: [0, 0.8, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: pos.duration, 
                  delay: pos.delay,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2,
                  ease: "easeInOut"
                }}
                className="absolute bg-white/80 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm"
                style={{ width: pos.size, height: pos.size }}
              />
            ))}
          </motion.div>

          {/* Sparkle Effects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute left-1/4 top-1/4"
            >
              <Sparkles className="w-6 h-6 text-white/40" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute right-1/4 bottom-1/4"
            >
              <Sparkles className="w-4 h-4 text-white/30" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* MOBILE: Feature Tags Below Image */}
        {isMobile && (
          <motion.div 
            className="relative w-full h-48 flex items-center justify-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {featureTags.map((tag, index) => (
              <motion.div
                key={index}
                custom={tag}
                variants={tagVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                className="absolute bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer whitespace-nowrap pointer-events-auto group/tag z-30"
                style={{ 
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.span 
                  className="text-xl"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {tag.emoji}
                </motion.span>
                <span className="text-gray-900 font-bold tracking-wide bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {tag.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* DESKTOP: Feature Tags Around Image */}
        {!isMobile && (
          <div className="absolute inset-0 pointer-events-none">
            {featureTags.map((tag, index) => (
              <motion.div
                key={index}
                custom={tag}
                variants={tagVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                className="absolute left-1/2 top-1/2 bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl px-5 py-4 rounded-2xl text-base font-semibold flex items-center gap-3 cursor-pointer whitespace-nowrap pointer-events-auto group/tag z-30"
                style={{ 
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.span 
                  className="text-2xl"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {tag.emoji}
                </motion.span>
                <span className="text-gray-900 font-bold tracking-wide bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {tag.text}
                </span>
                
                {/* Animated connector line */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 0.6 }}
                  transition={{ delay: tag.delay + 0.8, duration: 0.8 }}
                  className={`absolute h-0.5 bg-gradient-to-r from-gray-600 to-transparent ${
                    tag.finalX < 0 ? 'left-full ml-4' : 'right-full mr-4'
                  } w-12 top-1/2 transform -translate-y-1/2 ${
                    tag.finalX < 0 ? 'origin-left' : 'origin-right'
                  }`}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Enhanced Heading and CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8 mt-8 sm:mt-12">
          <motion.button
            initial={{ y: 80, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ 
              delay: 1.8, 
              duration: 1, 
              type: "spring", 
              stiffness: 80, 
              damping: 10 
            }}
            whileHover={{ 
              scale: 1.08, 
              y: -2,
              boxShadow: "0 20px 40px rgba(255,255,255,0.3)" 
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto bg-white text-gray-900 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl shadow-2xl hover:bg-gray-50 transition-all duration-300 group/cta relative overflow-hidden"
          >
            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <span className="flex items-center gap-3 group-hover/cta:gap-4 transition-all duration-300 relative z-10">
              Explore Collection
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </span>
          </motion.button>

          <motion.div
            initial={{ x: 100, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ 
              duration: 1.2, 
              delay: 1.2, 
              type: "spring", 
              stiffness: 80, 
              damping: 10 
            }}
            className="text-center sm:text-right w-full sm:w-auto"
          >
            <h1 className="text-3xl font-black text-white leading-tight tracking-tight">
              <motion.span
                initial={{ backgroundPosition: "200% 0" }}
                animate={{ backgroundPosition: "-200% 0" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent bg-[length:200%_auto]"
              >
                Premium
              </motion.span>
              <br />
              <motion.span
                initial={{ backgroundPosition: "-200% 0" }}
                animate={{ backgroundPosition: "200% 0" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent bg-[length:200%_auto]"
              >
                Performance
              </motion.span>
            </h1>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShoeCard;