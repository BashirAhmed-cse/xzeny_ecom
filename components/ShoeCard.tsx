"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface ShoeCardProps {
  activeSection: "hero" | "airmax" | "shoecard";
  isAnimating: boolean;
  scrollDirection: "up" | "down";
  currentColorTheme: any;
  productImage: string;
  currentProduct: any;
  onScrollUp: () => void;
}

const ShoeCard: React.FC<ShoeCardProps> = ({
  activeSection,
  isAnimating,
  scrollDirection,
  currentColorTheme,
  productImage,
  currentProduct,
  onScrollUp,
}) => {
  // Animation variants for 3-section flow
  const imageVariants = {
    scrollDownEnter: {
      scale: 1,
      y: 0,
      x: 0,
      rotate: 0,
      opacity: 1,
      filter: "blur(0px) brightness(1)",
      transition: {
        duration: 0.7,
        ease: [0.25, 0.8, 0.25, 1],
      },
    },
    scrollUpExit: {
      scale: 0.9,
      y: 150,
      x: 120,
      rotate: -10,
      opacity: 0,
      filter: "blur(3px) brightness(0.7)",
      transition: {
        duration: 0.7,
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
      scale: 1.1,
      y: -10,
      rotate: -2,
      transition: { duration: 0.3 }
    }
  };

  // Fixed tag variants without multiple keyframes
  const tagVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.3,
      x: 0,
      y: 0,
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
    hover: {
      scale: 1.15,
      y: (config: { finalY: number }) => config.finalY - 8,
      backgroundColor: "rgba(255,255,255,0.95)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
      transition: { 
        duration: 0.3,
      }
    },
    tap: {
      scale: 0.9,
      transition: { duration: 0.1 }
    }
  };

  const backgroundVariants = {
    hidden: { scale: 0.6, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 0.08,
      transition: { duration: 1.5, ease: "easeOut" }
    }
  };

  // Tag configuration with final positions and animation delays
  const featureTags = [
    { 
      text: "Slip-resistant", 
      emoji: "🔒", 
      finalX: -320, 
      finalY: -40,
      rotation: -5,
      delay: 0.1
    },
    { 
      text: "Lightweight", 
      emoji: "⚡", 
      finalX: 320, 
      finalY: -60,
      rotation: 8,
      delay: 0.2
    },
    { 
      text: "Eco-friendly", 
      emoji: "🌿", 
      finalX: -400, 
      finalY: 80,
      rotation: -8,
      delay: 0.3
    },
    { 
      text: "Quick-dry", 
      emoji: "💨", 
      finalX: 350, 
      finalY: 60,
      rotation: 6,
      delay: 0.4
    },
    { 
      text: "Shock absorption", 
      emoji: "🛡️", 
      finalX: 340, 
      finalY: 150,
      rotation: 12,
      delay: 0.5
    },
    { 
      text: "Durable", 
      emoji: "🪡", 
      finalX: -340, 
      finalY: 150,
      rotation: -12,
      delay: 0.6
    },
  ];

  if (activeSection === "hero" || activeSection === "airmax") return null;

  return (
    <motion.div 
      className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden"
      style={{ backgroundColor: currentColorTheme.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: activeSection === "shoecard" ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
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
      >
        <div className="flex items-center gap-2">
          <ArrowUp className="w-4 h-4" />
          <span className="text-xs font-medium">Back to AirMax</span>
        </div>
      </motion.button>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
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

      {/* Enhanced Nike swoosh background */}
      <motion.div
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 flex items-center justify-center"
      >
        <Image
          src="/logo.png"
          alt="Nike Swoosh"
          width={1000}
          height={1000}
          className="object-contain w-[80%] sm:w-full max-w-[600px] opacity-20"
        />
      </motion.div>

      <div className="relative w-full max-w-6xl">
        {/* Enhanced Shoe Container with Animation */}
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
          className="flex justify-center relative z-10 cursor-pointer mb-8 sm:mb-0"
          onClick={onScrollUp}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 blur-xl rounded-full scale-110" />
          
          <Image
            src={productImage}
            alt={currentProduct.name}
            width={800}
            height={800}
            className="object-contain drop-shadow-2xl relative z-20 w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[600px]"
          />

          {/* Center burst effect */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="absolute inset-0 bg-white/30 rounded-full blur-sm"
          />

          {/* Enhanced Floating Feature Tags with Center-to-Sides Animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            {featureTags.map((tag, i) => (
              <motion.div
                key={i}
                custom={{
                  delay: tag.delay,
                  finalX: tag.finalX,
                  finalY: tag.finalY,
                  rotation: tag.rotation
                }}
                variants={tagVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                className="absolute bg-white/90 backdrop-blur-sm border border-white/60 shadow-2xl px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-sm font-medium flex items-center gap-2 cursor-pointer whitespace-nowrap z-30"
                style={{
                  transformOrigin: "center center"
                }}
              >
                <span className="text-lg sm:text-xl">{tag.emoji}</span>
                <span className="text-gray-800 font-semibold">{tag.text}</span>
                
                {/* Animated connection line */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 0.4 }}
                  transition={{ delay: tag.delay + 0.4, duration: 0.6 }}
                  className="absolute w-8 sm:w-12 h-0.5 bg-gray-500 -left-8 sm:-left-12 top-1/2 transform -translate-y-1/2 origin-right"
                />
              </motion.div>
            ))}
          </div>

          {/* Floating particles effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 0 
                }}
                animate={{ 
                  scale: 1,
                  x: Math.cos(i * 0.78) * 100,
                  y: Math.sin(i * 0.78) * 100,
                  opacity: 0.6
                }}
                transition={{ 
                  duration: 1.5,
                  delay: 0.5 + i * 0.1,
                }}
                className="absolute w-1 h-1 bg-white rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Heading */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mt-4 sm:mt-10">
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl text-center hover:bg-gray-100 transition-all duration-300"
          >
            Explore Collection →
          </motion.button>
          
          <motion.div
            initial={{ x: 100, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
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