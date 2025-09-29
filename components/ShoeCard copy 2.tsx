"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface ShoeCardProps {
  activeSection: "hero" | "airmax" | "shoecard";
  isAnimating: boolean;
  scrollDirection: "up" | "down";
  onScrollUp: () => void;
}

const ShoeCard: React.FC<ShoeCardProps> = ({
  activeSection,
  isAnimating,
  scrollDirection,
  onScrollUp,
}) => {
  // Animation variants for 3-section flow
  const imageVariants = {
    scrollDownEnter: {
      scale: [0.9, 1.4, 1],
      y: [150, -200, 0],
      x: [-120, 80, 0],
      rotate: [10, -15, 0],
      opacity: [0, 0.95, 1],
      filter: ["blur(3px) brightness(0.7)", "blur(2px) brightness(1.3)", "blur(0px) brightness(1)"],
      transition: {
        duration: 0.7,
        times: [0, 0.5, 1],
        ease: [0.25, 0.8, 0.25, 1],
      },
    },
    scrollUpExit: {
      scale: [1, 1.4, 0.9],
      y: [0, -200, 150],
      x: [0, -80, 120],
      rotate: [0, 15, -10],
      opacity: [1, 0.95, 0],
      filter: ["blur(0px) brightness(1)", "blur(2px) brightness(1.3)", "blur(3px) brightness(0.7)"],
      transition: {
        duration: 0.7,
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
      scale: 1.1,
      y: -10,
      rotate: -2,
      transition: { duration: 0.3 }
    }
  };

  const tagVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        delay: i * 0.1, 
        type: "spring", 
        stiffness: 150,
        damping: 8
      },
    }),
    hover: {
      scale: 1.05,
      backgroundColor: "rgba(255,255,255,0.95)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      transition: { duration: 0.2 }
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

  if (activeSection === "hero" || activeSection === "airmax") return null;

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center p-4 sm:p-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: activeSection === "shoecard" ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scroll Up Button */}
      <motion.button
        onClick={onScrollUp}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 text-gray-700 hover:text-gray-900 backdrop-blur-md bg-white/80 hover:bg-white px-5 py-2 rounded-full border border-gray-200 transition-all duration-300"
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
          className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-2xl sm:blur-3xl opacity-10"
        />
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 2, delay: 0.7 }}
          className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-2xl sm:blur-3xl opacity-10"
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
          className="object-contain w-[80%] sm:w-full max-w-[600px]"
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
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 blur-xl rounded-full scale-110" />
          
          <Image
            src="/images/jordan-red.png"
            alt="Premium Shoe"
            width={800}
            height={800}
            className="object-contain drop-shadow-2xl relative z-20 w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[600px]"
          />

          {/* Enhanced Floating Feature Tags */}
          {[
            { text: "Slip-resistant", emoji: "🔒", className: "top-2 sm:top-5 left-2 sm:left-4" },
            { text: "Lightweight", emoji: "⚡", className: "top-4 sm:top-8 right-4 sm:right-20" },
            { text: "Eco-friendly", emoji: "🌿", className: "bottom-20 sm:bottom-24 left-2 sm:left-4" },
            { text: "Quick-dry", emoji: "💨", className: "bottom-12 sm:bottom-16 right-4 sm:right-10" },
            { text: "Shock absorption", emoji: "🛡️", className: "bottom-32 sm:bottom-44 right-4 sm:right-16" },
            { text: "Durable", emoji: "🪡", className: "bottom-32 sm:bottom-44 left-4 sm:left-16" },
          ].map((tag, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={tagVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className={`absolute bg-white/90 backdrop-blur-sm border border-white shadow-lg px-2 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 cursor-pointer ${tag.className} max-w-[120px] sm:max-w-none`}
            >
              <span className="text-sm sm:text-lg">{tag.emoji}</span>
              <span className="text-gray-800 whitespace-nowrap">{tag.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Heading */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mt-4 sm:mt-0">
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(239,68,68,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl text-center"
          >
            Explore Collection →
          </motion.button>
          
          <motion.div
            initial={{ x: 100, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8, type: "spring" }}
            className="text-center sm:text-right w-full sm:w-auto"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Quality
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
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