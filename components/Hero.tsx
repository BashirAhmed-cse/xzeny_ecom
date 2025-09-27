"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const Hero: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState("/images/jordan-red.png");

  const thumbnails = [
    { src: "/images/jordan-blue.png", alt: "Nike Air Max Pre-Day" },
    { src: "/images/jordan-red.png", alt: "Red Jordan" },
  ];

  const productData = {
    blue: { 
      name: "JORDAN BLUE", 
      image: "/images/jordan-blue2.png", 
      releaseDate: "2016-10-06", 
      colorWay: "SAIL/STARFISH-BLACK",
    },
    green: { 
      name: "JORDAN GREEN", 
      image: "/images/jordan-green2.png", 
      releaseDate: "2025-10-06", 
      colorWay: "SAIL/FOREST-GREEN",
    },
    red: { 
      name: "JORDAN RED", 
      image: "/images/jordan-red2.png", 
      releaseDate: "2025-10-06", 
      colorWay: "SAIL/SCARLET-RED",
    },
  };
  return (
    <motion.section
      className={cn(
        "min-h-screen flex items-center justify-center relative overflow-hidden",
        "pt-20 lg:pt-0 bg-gray-950 text-white"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div>
          <motion.div
            className="w-full flex flex-col-reverse lg:flex-row items-center justify-center gap-8 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Left Side Title with Modern Slide-Up Animation */}
            <motion.div
              className="flex flex-col gap-6 items-start self-start"
              initial={{ y: 80, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{
                delay: 0.3,
                duration: 0.9,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <motion.h1
                className="text-4xl  font-light leading-tight"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Wear your Style
                </span>
                <span className="block text-gray-400 mt-2">with comfort.</span>
              </motion.h1>

             
            </motion.div>

            {/* Main Shoe Section - KEEP ORIGINAL ANIMATION */}
            <div className="relative flex-1 flex justify-center items-center overflow-hidden">
              {/* Ellipse background */}
              <Image
                src="/ellips.svg"
                alt="Ellipse Background"
                width={650}
                height={600}
                className="absolute object-contain opacity-80 top-1/2 left-1/2 -translate-x-1/2 translate-y-1/3 z-0 mt-25"
              />

              {/* Shoe image with ORIGINAL AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ x: "100vw", opacity: 0, rotate: 15 }}
                  animate={{ x: 0, opacity: 1, rotate: 0 }}
                  exit={{ x: "-100vw", opacity: 0, rotate: -15 }}
                  transition={{ type: "spring", stiffness: 80, damping: 18 }}
                  className="relative z-10"
                >
                  <Image
                    src={selectedImage}
                    alt="Nike Air Max Pre-Day"
                    width={700}
                    height={600}
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails with Modern Stagger Animation */}
            <motion.div
              className="flex flex-row lg:flex-col gap-4 items-start self-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {thumbnails
                .filter((thumb) => thumb.src !== selectedImage)
                .map((thumb, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setSelectedImage(thumb.src)}
                    aria-label={`Switch to ${thumb.alt}`}
                    className="relative w-24 h-16 lg:w-28 lg:h-20 rounded-xl overflow-hidden border-2 transition-all border-gray-700 hover:border-white group"
                    initial={{
                      scale: 0.8,
                      opacity: 0,
                      x: 30,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.8 + i * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{
                      scale: 1.1,
                      y: -5,
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Image
                      src={thumb.src}
                      alt={thumb.alt}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  </motion.button>
                ))}
            </motion.div>
          </motion.div>
     
        </div>
<div className="flex justify-between mt-4">
 <span className="block text-gray-400 mt-2">JORDAN RED.</span>
  <motion.div 
                className="flex gap-4 items-center justify-center mt-12"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white border-2 border-white/40 rounded-full hover:bg-white/20 backdrop-blur-sm h-12 w-12"
         
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white border-2 border-white/40 rounded-full hover:bg-white/20 backdrop-blur-sm h-12 w-12"
              
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </motion.div>
  <motion.button
                className="px-8 py-3 bg-white text-gray-900 rounded-full font-medium mt-4 hover:bg-gray-100 transition-colors"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(255,255,255,0.2)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Now
              </motion.button>
</div>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-950 z-0" />
    </motion.section>
  );
};

export default Hero;
