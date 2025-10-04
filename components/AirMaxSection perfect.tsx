"use client";

import { useState, useMemo } from "react";
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
  selectedProduct: ProductColor;
  currentImageIndex: number;
  onScrollUp: () => void;
  onScrollDown: () => void;
}

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
  selectedProduct,
  currentImageIndex,
  onScrollUp,
  onScrollDown,
}) => {
  const [imageError, setImageError] = useState(false);

  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 1024,
    []
  );
  const ANIMATION_DURATION = 500;
  const features = currentProduct.features || defaultFeatures;
  const price = currentProduct.price || "$149.99";
  const imageSrc = imageError ? "/images/fallback-shoe.png" : productImage;

  const imageVariants = {
    initial: {
      opacity: 0,
      scale: 1.1,
      x: 200,
      filter: "blur(12px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: ANIMATION_DURATION / 1000 * 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const textVariants = {
    initial: {
      opacity: 0,
      x: -50,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: ANIMATION_DURATION / 1000,
        delay: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: currentColorTheme.bg }}
    >
      {/* Navigation Buttons */}
      <div
        className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex ${
          isMobile ? "flex-col" : "gap-4"
        }`}
      >
        <button
          onClick={onScrollUp}
          className="text-white/85 hover:text-white backdrop-blur-md bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full border border-white/25 transition-all duration-300"
        >
          <div className="flex items-center gap-2">
            <ArrowUp className="w-4 h-4" />
            <span className="text-xs font-medium">Back to top</span>
          </div>
        </button>

        <button
          onClick={onScrollDown}
          className="text-white/85 hover:text-white backdrop-blur-md bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full border border-white/25 transition-all duration-300"
        >
          <div className="flex items-center gap-2">
            <ArrowDown className="w-4 h-4" />
            <span className="text-xs font-medium">Next section</span>
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center h-screen">
        {/* Left Side - Text Content */}
        <motion.div 
          className="space-y-8 text-white lg:col-span-4 order-2 lg:order-1 px-8 lg:px-12 xl:px-16"
          variants={textVariants}
          initial="initial"
          animate={activeSection === "airmax" ? "animate" : "initial"}
        >
          {/* Brand and Title */}
          <div className="space-y-6">
            <h1 className="text-5xl font-black leading-none">
              <span className="block bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Airmax
              </span>
            </h1>
            
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                270
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 text-white bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-base font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Price and CTA */}
          <div className="space-y-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white">{price}</span>
              <span className="text-white/60 text-base">+ Free Shipping</span>
            </div>
            
            <Button className="bg-white text-black px-10 py-6 rounded-full font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 text-lg shadow-2xl shadow-black/30">
              <ShoppingCart className="w-6 h-6 mr-3" />
              Add to Cart
            </Button>
          </div>
        </motion.div>

        {/* Right Side - Extra Large Image (25% bigger) */}
        <motion.div 
          className="relative lg:col-span-8 order-1 lg:order-2 w-full h-[50vh] lg:h-screen overflow-visible"
          variants={imageVariants}
          initial="initial"
          animate={activeSection === "airmax" ? "animate" : "initial"}
        >
          {/* Main Shoe Image - 25% bigger */}
          <motion.div
            layoutId={`product-image-${selectedProduct}-${currentImageIndex}`}
            className={`relative ${
              isMobile 
                ? 'w-full h-full' 
                : 'w-[75%] h-full -right-[12.5%]'
            }`}
          >
            <Image
              src={imageSrc}
              alt={currentProduct.name}
              width={1600}
              height={1000}
              priority
              sizes="(max-width: 1024px) 100vw, 125vw"
              className={`object-contain ${
                isMobile 
                  ? 'w-full h-full' 
                  : 'w-[125%] h-full max-w-none transform scale-150'
              }`}
              onError={() => setImageError(true)}
            />
          </motion.div>

          {/* Ellipse Shadow - Adjusted for larger image */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-24 blur-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: activeSection === "airmax" ? 0.6 : 0,
              scale: 1
            }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="w-full h-full bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AirMaxSection;