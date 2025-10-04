"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import type { HeroSectionProps } from "./HeroSection";

const AddToCartSection = (props: HeroSectionProps) => {
  const { currentProduct, currentImageIndex, onImageIndexChange, onScrollDown } = props;

  return (
    <div className="hidden lg:flex flex-col lg:flex-row justify-between items-center mb-2 gap-6">
      <motion.button
        className="relative flex items-center justify-center gap-3 w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-4 rounded-xl font-semibold text-base sm:text-lg text-white bg-gradient-to-r from-gray-900 to-gray-700 shadow-gray-900/25 border-0 hover:shadow-xl hover:shadow-purple-500/40 hover:from-purple-700 hover:to-blue-600 active:scale-95 transition-all duration-300 group overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onScrollDown}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <ShoppingCart className="w-5 sm:w-6 h-5 sm:h-6 transition-transform group-hover:scale-110" />
        <span className="font-semibold tracking-wide">Add to cart</span>
      </motion.button>

      <motion.div className="flex gap-2 items-center">
        {currentProduct.images.map((img, index) => (
          <button
            key={index}
            onClick={() => onImageIndexChange(index)}
            className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              currentImageIndex === index
                ? "border-white scale-105 shadow-md shadow-white/20"
                : "border-gray-700 hover:border-white hover:scale-105"
            }`}
          >
            <Image
              src={img}
              alt={`Preview ${index + 1}`}
              fill
              sizes="(max-width: 640px) 80px, 120px"
              className="object-cover transition-transform hover:scale-110"
            />
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default AddToCartSection;
