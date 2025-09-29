
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "./ui/button";

type ProductColor = "black" | "red";

interface Product {
  name: string;
  images: string[];
  releaseDate: string;
  colorWay: string;
}

const Hero: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductColor>("black");
  const [selectedColor, setSelectedColor] = useState<ProductColor>("black");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSection, setActiveSection] = useState<"hero" | "airmax" | "shoecard">("hero");
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const heroRef = useRef<HTMLDivElement>(null);
  const airMaxRef = useRef<HTMLDivElement>(null);
  const shoeCardRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const isScrolling = useRef(false);

  const colorThemes: Record<ProductColor, string> = {
    black: "#0a0a0a",
    red: "#9b1b1b",
  };

  const productData: Record<ProductColor, Product> = {
    black: {
      name: "AIR MAX 270",
      images: ["/images/jordan-blue.png", "/images/jordan-blue2.png"],
      releaseDate: "2016-10-06",
      colorWay: "SAIL/STARFISH-BLACK",
    },
    red: {
      name: "AIR MAX 90",
      images: ["/images/jordan-red.png", "/images/jordan-red2.png"],
      releaseDate: "2025-10-06",
      colorWay: "SAIL/SCARLET-RED",
    },
  };

  const currentProduct = productData[selectedProduct];
  const imageSrc = currentProduct.images[currentImageIndex];

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === currentProduct.images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? currentProduct.images.length - 1 : prev - 1));
  };

  // Scroll animation function
  const animateScroll = (target: "hero" | "airmax" | "shoecard") => {
    if (isAnimating || isScrolling.current) return;

    console.log(`Scrolling to ${target}, activeSection: ${activeSection}`); // Debug
    setIsAnimating(true);
    setScrollDirection(target === "hero" ? "up" : "down");
    setActiveSection(target);
    isScrolling.current = true;

    const targetRef = target === "hero" ? heroRef : target === "airmax" ? airMaxRef : shoeCardRef;
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      console.error(`No ref found for ${target}`); // Debug
    }

    setTimeout(() => {
      setIsAnimating(false);
      isScrolling.current = false;
      console.log(`Scroll complete, activeSection: ${target}`); // Debug
    }, 700);
  };


// In handleScroll effect
useEffect(() => {
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const direction = scrollY > lastScrollY.current ? "down" : "up";
    lastScrollY.current = scrollY;

    if (isAnimating || isScrolling.current) return;

    setScrollDirection(direction); // ✅ update here instead of animateScroll

    const heroRect = heroRef.current?.getBoundingClientRect();
    const airMaxRect = airMaxRef.current?.getBoundingClientRect();
    const shoeCardRect = shoeCardRef.current?.getBoundingClientRect();

    if (!heroRect || !airMaxRect || !shoeCardRect) return;

    const viewportHeight = window.innerHeight;

    if (direction === "down" && activeSection === "hero") {
      animateScroll("airmax");
    } else if (direction === "down" && activeSection === "airmax") {
      animateScroll("shoecard");
    } else if (direction === "up" && activeSection === "shoecard") {
      animateScroll("airmax");
    } else if (direction === "up" && activeSection === "airmax") {
      animateScroll("hero");
    }
  };

  let ticking = false;
  const throttledScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", throttledScroll, { passive: true });
  return () => window.removeEventListener("scroll", throttledScroll);
}, [activeSection, isAnimating]);


  // Animation variants
  const imageVariants = {
    scrollDown: {
      scale: [1, 1.2, 0.9],
      y: [0, -100, 50],
      opacity: [1, 0.95, 0],
      transition: { duration: 0.8, type: "spring", stiffness: 100, damping: 10 },
    },
    scrollUp: {
      scale: [0.9, 1.2, 1],
      y: [50, -100, 0],
      opacity: [0, 0.95, 1],
      transition: { duration: 0.8, type: "spring", stiffness: 100, damping: 10 },
    },
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, type: "spring", stiffness: 100, damping: 12 },
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: { duration: 0.3, type: "spring", stiffness: 150, damping: 8 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, type: "spring", stiffness: 120, damping: 10 } },
  };

  return (
    <>
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className={cn(
          "min-h-screen flex items-center justify-center relative",
          "pt-8 lg:pt-0 text-white px-4 sm:px-6 lg:px-8"
        )}
        style={{ backgroundColor: colorThemes[selectedColor] }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[rgba(10,10,10,0.7)] to-[rgba(10,10,10,0.2)]" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white/20 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, Math.random() * -40 + 20, 0], opacity: [0, 0.3, 0], scale: [0, 0.5, 0] }}
              transition={{ duration: Math.random() * 2 + 1.5, repeat: Infinity, delay: Math.random() * 0.8, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-[80vh]">
            <motion.div className="col-span-1 lg:col-span-5 space-y-5" variants={itemVariants}>
              <div>
                <motion.span className="text-xs uppercase tracking-widest text-gray-300 font-medium" variants={itemVariants}>
                  New Release • {currentProduct.releaseDate}
                </motion.span>
                <motion.h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mt-2" variants={itemVariants}>
                  <span className="block bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    {currentProduct.name}
                  </span>
                </motion.h1>
              </div>
              <motion.p className="text-gray-200 text-base sm:text-lg leading-relaxed max-w-md" variants={itemVariants}>
                Unmatched comfort with our largest Air unit. Premium materials for all-day style. Colorway: {currentProduct.colorWay}
              </motion.p>
              <motion.div className="flex gap-4" variants={itemVariants}>
                <Button
                  onClick={() => animateScroll("airmax")}
                  className="bg-white text-black px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Discover AirMax
                </Button>
              </motion.div>
              <motion.div className="flex gap-3" variants={itemVariants}>
                {(Object.keys(productData) as ProductColor[]).map((color) => (
                  <motion.button
                    key={color}
                    onClick={() => {
                      setSelectedProduct(color);
                      setSelectedColor(color);
                      setCurrentImageIndex(0);
                    }}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all duration-300",
                      selectedProduct === color ? "border-white scale-110 shadow-lg" : "border-gray-500 hover:border-gray-300"
                    )}
                    style={{ backgroundColor: colorThemes[color] }}
                    whileHover={{ scale: 1.3, rotate: 10, boxShadow: "0 0 12px rgba(255,255,255,0.4)" }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </motion.div>
            </motion.div>

            <div className="col-span-1 lg:col-span-7 relative flex justify-center items-center">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="relative cursor-pointer group"
                variants={imageVariants}
                initial="hidden"
                animate={
                  isAnimating && scrollDirection === "down" && activeSection === "hero"
                    ? "scrollDown"
                    : isAnimating && scrollDirection === "up" && activeSection === "airmax"
                    ? "scrollUp"
                    : "visible"
                }
                whileHover="hover"
                onClick={() => animateScroll("airmax")}
                style={{ willChange: "transform, opacity" }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
                >
                  <Image
                    src={imageSrc}
                    alt={currentProduct.name}
                    width={800}
                    height={600}
                    className="object-contain w-full h-auto drop-shadow-2xl transition-all duration-300 group-hover:drop-shadow-[0_30px_30px_rgba(0,0,0,0.5)]"
                    priority
                  />
                </motion.div>
                <motion.div
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white/85 text-sm flex items-center gap-2 backdrop-blur-md bg-white/20 px-4 py-2 rounded-full border border-white/25"
                  animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowDown className="w-4 h-4 animate-pulse" />
                  <span>Scroll to AirMax</span>
                </motion.div>
              </motion.div>
              {activeSection === "hero" && !isAnimating && (
                <motion.div
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 backdrop-blur-md bg-white/20 px-5 py-2 rounded-full border border-white/25"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrev}
                    className="text-white border border-white/30 rounded-full hover:bg-white/30 hover:scale-110 transition-all duration-300"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="flex gap-2 items-center">
                    {currentProduct.images.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "w-2.5 h-2.5 rounded-full transition-all",
                          index === currentImageIndex ? "bg-white scale-125" : "bg-white/40"
                        )}
                        whileHover={{ scale: 1.5 }}
                        transition={{ duration: 0.2 }}
                      />
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                    className="text-white border border-white/30 rounded-full hover:bg-white/30 hover:scale-110 transition-all duration-300"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
          {activeSection === "hero" && !isAnimating && (
            <motion.div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/85 cursor-pointer"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              onClick={() => animateScroll("airmax")}
            >
              <motion.div
                className="backdrop-blur-md bg-white/20 px-3 py-2 rounded-full border border-white/25 hover:bg-white/30 transition-all duration-300"
                whileHover={{ scale: 1.15, rotate: 180 }}
              >
                <ArrowDown className="w-5 h-5" />
              </motion.div>
              <motion.span className="text-xs font-medium bg-white/15 backdrop-blur-md px-3 py-1 rounded-full" whileHover={{ scale: 1.15 }}>
                Scroll to AirMax
              </motion.span>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* AirMax Section */}
      <div>
        <AirMaxSection
          sectionRef={airMaxRef} // Pass ref as prop
          activeSection={activeSection}
          isAnimating={isAnimating}
          scrollDirection={scrollDirection}
          backgroundColor={colorThemes[selectedColor]}
          productImage={imageSrc}
          currentProduct={currentProduct}
          onScrollUp={() => animateScroll("hero")}
          onScrollDown={() => animateScroll("shoecard")}
        />
      </div>

      {/* ShoeCard Section */}
      <div ref={shoeCardRef}>
        <ShoeCardSection
          activeSection={activeSection}
          isAnimating={isAnimating}
          scrollDirection={scrollDirection}
          backgroundColor={colorThemes[selectedColor]}
          productImage={imageSrc}
          currentProduct={currentProduct}
          onScrollUp={() => animateScroll("airmax")}
        />
      </div>
    </>
  );
};

// AirMax Section Component
interface AirMaxSectionProps {
  sectionRef: React.RefObject<HTMLDivElement>; // Add ref prop
  activeSection: "hero" | "airmax" | "shoecard";
  isAnimating: boolean;
  scrollDirection: "up" | "down";
  backgroundColor: string;
  productImage: string;
  currentProduct: Product;
  onScrollUp: () => void;
  onScrollDown: () => void;
}

const AirMaxSection: React.FC<AirMaxSectionProps> = ({
  sectionRef, // Receive ref prop
  activeSection,
  isAnimating,
  scrollDirection,
  backgroundColor,
  productImage,
  currentProduct,
  onScrollUp,
  onScrollDown,
}) => {
  console.log("AirMaxSection rendering, activeSection:", activeSection); // Debug

  const imageVariants = {
    scrollDownEnter: {
      scale: [0.9, 1.2, 1],
      y: [50, -100, 0],
      opacity: [0, 0.95, 1],
      transition: { duration: 0.8, type: "spring", stiffness: 100, damping: 10 },
    },
    scrollUpExit: {
      scale: [1, 1.2, 0.9],
      y: [0, -100, 50],
      opacity: [1, 0.95, 0],
      transition: { duration: 0.8, type: "spring", stiffness: 100, damping: 10 },
    },
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, type: "spring", stiffness: 100, damping: 12 } },
    hover: { scale: 1.05, y: -10, transition: { duration: 0.3, type: "spring", stiffness: 150, damping: 8 } },
  };

  // Temporarily remove conditional rendering for debugging
  // if (activeSection !== "airmax") return null;

  return (
    <motion.section
      ref={sectionRef} // Use passed ref
      className="min-h-screen relative flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/3 -left-16 w-80 h-80 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute bottom-1/3 -right-16 w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl"
        />
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/20 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, Math.random() * 40 - 20, 0], opacity: [0, 0.3, 0], scale: [0, 0.5, 0] }}
            transition={{ duration: Math.random() * 2 + 1.5, repeat: Infinity, delay: Math.random() * 0.8, ease: "easeInOut" }}
          />
        ))}
      </div>

      <motion.button
        onClick={onScrollUp}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 text-white/85 hover:text-white backdrop-blur-md bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full border border-white/25 transition-all duration-300"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <ArrowUp className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-medium">Back to top</span>
        </div>
      </motion.button>

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-10">
        <motion.div
          className="space-y-5 text-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120, damping: 10 }}
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
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
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
                  hidden: { y: 20, opacity: 0, scale: 0.8 },
                  visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 150, damping: 8 } },
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
            <Button className="bg-white text-black px-6 py-3 sm:px-8 sm:py-3.5 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Buy Now • $149.99
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="relative flex justify-center items-center cursor-pointer group"
          variants={imageVariants}
          initial="hidden"
          animate={
            isAnimating && scrollDirection === "down" && activeSection === "airmax"
              ? "scrollDownEnter"
              : isAnimating && scrollDirection === "up" && activeSection === "airmax"
              ? "scrollUpExit"
              : "visible"
          }
          whileHover="hover"
          onClick={onScrollDown}
          style={{ willChange: "transform, opacity" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-full blur-xl scale-110"
            animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <Image
            src={productImage}
            alt={currentProduct.name}
            width={600}
            height={500}
            className="object-contain drop-shadow-2xl relative z-20 w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[600px] transition-all duration-300 group-hover:drop-shadow-[0_30px_30px_rgba(0,0,0,0.5)]"
          />
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white/85 text-sm flex items-center gap-2 backdrop-blur-md bg-white/20 px-4 py-2 rounded-full border border-white/25"
            animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 animate-pulse" />
            <span>Scroll to Details</span>
          </motion.div>
        </motion.div>
      </div>
      {activeSection === "airmax" && !isAnimating && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/85 cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          onClick={onScrollDown}
        >
          <motion.div
            className="backdrop-blur-md bg-white/20 px-3 py-2 rounded-full border border-white/25 hover:bg-white/30 transition-all duration-300"
            whileHover={{ scale: 1.15, rotate: 180 }}
          >
            <ArrowDown className="w-5 h-5" />
          </motion.div>
          <motion.span className="text-xs font-medium bg-white/15 backdrop-blur-md px-3 py-1 rounded-full" whileHover={{ scale: 1.15 }}>
            Scroll to Details
          </motion.span>
        </motion.div>
      )}
      {/* Debug message */}
      <div className="absolute top-0 left-0 p-4 text-white z-30">
        AirMax Section (Visible: {activeSection})
      </div>
    </motion.section>
  );
};

// ShoeCard Section Component
interface ShoeCardSectionProps {
  activeSection: "hero" | "airmax" | "shoecard";
  isAnimating: boolean;
  scrollDirection: "up" | "down";
  backgroundColor: string;
  productImage: string;
  currentProduct: Product;
  onScrollUp: () => void;
}

const ShoeCardSection: React.FC<ShoeCardSectionProps> = ({
  activeSection,
  isAnimating,
  scrollDirection,
  backgroundColor,
  productImage,
  currentProduct,
  onScrollUp,
}) => {
  const tagVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.1, type: "spring", stiffness: 150, damping: 8 },
    }),
    hover: {
      scale: 1.05,
      backgroundColor: "rgba(255,255,255,0.95)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      transition: { duration: 0.2 },
    },
  };

  const shoeVariants = {
  scrollDownEnter: {
    scale: [0.9, 1.1, 1],
    y: [50, -100, 0],
    opacity: [0, 0.95, 1],
    transition: { duration: 0.8, type: "spring", stiffness: 100, damping: 12 },
  },
  scrollUpExit: {
    scale: [1, 1.1, 0.9],
    y: [0, -100, 50],
    opacity: [1, 0.95, 0],
    transition: { duration: 0.8, type: "spring", stiffness: 100, damping: 12 },
  },
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, type: "spring", stiffness: 80, damping: 12 } },
  hover: { scale: 1.05, y: -10, transition: { duration: 0.4, type: "spring", stiffness: 150, damping: 8 } },
};


  const backgroundVariants = {
    hidden: { scale: 0.6, opacity: 0 },
    visible: { scale: 1, opacity: 0.08, transition: { duration: 1.5, ease: "easeOut" } },
  };

  if (activeSection !== "shoecard") return null;

  return (
    <motion.section
      className="min-h-screen relative flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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

      <motion.button
        onClick={onScrollUp}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 text-white/85 hover:text-white backdrop-blur-md bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full border border-white/25 transition-all duration-300"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <ArrowUp className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-medium">Back to AirMax</span>
        </div>
      </motion.button>

      <div className="relative w-full max-w-6xl">
        <motion.div
          variants={shoeVariants}
          initial="hidden"
          animate={isAnimating && scrollDirection === "up" && activeSection === "shoecard" ? "scrollUpExit" : "visible"}
          whileHover="hover"
          className="flex justify-center relative z-10 cursor-pointer mb-8 sm:mb-0"
          onClick={onScrollUp}
          style={{ willChange: "transform, opacity" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 blur-xl rounded-full scale-110" />
          <Image
            src={productImage}
            alt={currentProduct.name}
            width={800}
            height={800}
            className="object-contain drop-shadow-2xl relative z-20 w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[600px]"
          />
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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
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
    </motion.section>
  );
};

export default Hero;
