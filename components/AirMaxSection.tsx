"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUp, ArrowDown, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

interface AirMaxSectionProps {
  activeSection: "hero" | "airmax" | "shoecard";
  isAnimating: boolean;
  scrollDirection: "up" | "down";
  currentColorTheme: any;
  productImage: string;
  currentProduct: any;
  onScrollUp: () => void;
  onScrollDown: () => void;
}

const AirMaxSection: React.FC<AirMaxSectionProps> = ({
  activeSection,
  isAnimating,
  scrollDirection,
  currentColorTheme,
  productImage,
  currentProduct,
  onScrollUp,
  onScrollDown,
}) => {
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
    scrollDownExit: {
      scale: [1, 1.4, 0.9],
      y: [0, -200, 150],
      x: [0, 80, -120],
      rotate: [0, -15, 10],
      opacity: [1, 0.95, 0],
      filter: ["blur(0px) brightness(1)", "blur(2px) brightness(1.3)", "blur(3px) brightness(0.7)"],
      transition: {
        duration: 0.7,
        times: [0, 0.5, 1],
        ease: [0.25, 0.8, 0.25, 1],
      },
    },
    scrollUpEnter: {
      scale: [0.9, 1.4, 1],
      y: [150, -200, 0],
      x: [120, -80, 0],
      rotate: [-10, 15, 0],
      opacity: [0, 0.95, 1],
      filter: ["blur(3px) brightness(0.7)", "blur(2px) brightness(1.3)", "blur(0px) brightness(1)"],
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
      willChange: "transform, opacity, filter",
    },
    hover: {
      scale: 1.1,
      y: -10,
      rotate: 2,
      filter: "blur(0px) brightness(1.15)",
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  if (activeSection === "hero") return null;

  return (
    <motion.section
      className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden"
      style={{ backgroundColor: currentColorTheme.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: activeSection === "airmax" ? 1 : 0.3 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 40 - 20, 0],
              opacity: [0, Math.random() * 0.3 + 0.2, 0],
              scale: [0, Math.random() * 0.5 + 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 1.5,
              repeat: Infinity,
              delay: Math.random() * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-4">
        <motion.button
          onClick={onScrollUp}
          className="text-white/85 hover:text-white backdrop-blur-md bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full border border-white/25 transition-all duration-300"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
          >
            {[
              { icon: "✨", text: "Max Air Cushioning" },
              { icon: "🌿", text: "Eco-Friendly Materials" },
              { icon: "⚡", text: "Ultra-Lightweight" },
              { icon: "🔄", text: "Full Flexibility" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                className="flex items-center gap-2.5 text-white bg-white/15 backdrop-blur-md rounded-lg p-2.5 border border-white/20 hover:border-white/35 transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(255,255,255,0.2)" }}
              >
                <span className="text-lg">{feature.icon}</span>
                <span className="text-xs font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex gap-4">
            <Button className="bg-white text-black px-6 py-3 sm:px-8 sm:py-3.5 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Buy Now • $149.99
            </Button>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          className="relative flex justify-center items-center cursor-pointer group"
          variants={imageVariants}
          initial="normal"
          animate={
            isAnimating && scrollDirection === "down" && activeSection === "airmax"
              ? "scrollDownEnter"
              : isAnimating && scrollDirection === "up" && activeSection === "airmax"
              ? "scrollUpEnter"
              : isAnimating && scrollDirection === "down" && activeSection === "hero"
              ? "scrollDownExit"
              : isAnimating && scrollDirection === "up" && activeSection === "shoecard"
              ? "scrollUpExit"
              : "normal"
          }
          whileHover="hover"
          onClick={onScrollDown}
          style={{ willChange: "transform, opacity, filter" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.25, 0.4, 0.25],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <Image
            src={productImage}
            alt={currentProduct.name}
            width={600}
            height={500}
            className="object-contain drop-shadow-2xl transition-all duration-300 group-hover:drop-shadow-[0_30px_30px_rgba(0,0,0,0.5)]"
          />
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