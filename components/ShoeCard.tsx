"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ShoeCard() {
  // Enhanced animation variants
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

  const shoeVariants = {
    hidden: { y: 100, opacity: 0, rotateY: -15 },
    visible: { 
      y: 0, 
      opacity: 1, 
      rotateY: 0,
      transition: { 
        duration: 1.2, 
        type: "spring", 
        stiffness: 80,
        damping: 12
      }
    },
    hover: {
      y: -10,
      rotateY: 5,
      transition: { duration: 0.4 }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 180 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-3xl opacity-10"
        />
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 2, delay: 0.7 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-10"
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
          className="object-contain"
        />
      </motion.div>

      <div className="relative w-full max-w-6xl">
        {/* Enhanced Shoe Container */}
        <motion.div
          variants={shoeVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="flex justify-center relative z-10 cursor-pointer"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 blur-xl rounded-full scale-110" />
          
          <Image
            src="/images/jordan-red.png"
            alt="Premium Shoe"
            width={800}
            height={800}
            className="object-contain drop-shadow-2xl relative z-20"
          />

          {/* Enhanced Floating Feature Tags */}
          {[
            { text: "Slip-resistant sole", emoji: "🔒", className: "top-5 left-4" },
            { text: "Lightweight design", emoji: "⚡", className: "top-8 right-20" },
            { text: "Eco-friendly dyes", emoji: "🌿", className: "bottom-24 left-4" },
            { text: "Quick-dry lining", emoji: "💨", className: "bottom-16 right-10" },
     
            { text: "Shock absorption", emoji: "🛡️", className: "bottom-44 right-16" },
            { text: "Durable stitching", emoji: "🪡", className: "bottom-44 left-16" },
          ].map((tag, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={tagVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className={`absolute bg-white/90 backdrop-blur-sm border border-white shadow-lg px-4 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 cursor-pointer ${tag.className}`}
            >
              <span className="text-lg">{tag.emoji}</span>
              <span className="text-gray-800">{tag.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Heading */}
        <div className="flex justify-between">
             <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(239,68,68,0.3)" }}
          whileTap={{ scale: 0.95 }}
          className=" bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl"
        >
          Explore Collection →
        </motion.button>
         <motion.div
          initial={{ x: 100, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, type: "spring" }}
          className="absolute  right-12 text-right"
        >
          <h1 className="text-4xl font-black text-gray-900 leading-tight">
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
       

        {/* Floating CTA Button */}
       
      </div>
    </div>
  );
}