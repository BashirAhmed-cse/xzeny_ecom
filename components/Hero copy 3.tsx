
"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  const [activeSection, setActiveSection] = useState<"hero" | "airmax">("hero");
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const heroRef = useRef<HTMLDivElement>(null);
  const airMaxRef = useRef<HTMLDivElement>(null);
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

  // Scroll animation function for scroll and click
  const animateScroll = (direction: "up" | "down") => {
    if (isAnimating || isScrolling.current) return;

    setIsAnimating(true);
    setScrollDirection(direction);
    isScrolling.current = true;

    const targetSection = direction === "down" ? "airmax" : "hero";

    // Immediate state update for responsiveness
    setActiveSection(targetSection);
    setTimeout(() => {
      const targetRef = direction === "down" ? airMaxRef : heroRef;
      if (targetRef.current) {
        targetRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      setTimeout(() => {
        setIsAnimating(false);
        isScrolling.current = false;
      }, 700); // Shortened reset time
    }, 50); // Minimal delay for smooth start
  };

  // Optimized scroll detection for reliable scroll-down
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY.current ? "down" : "up";
      lastScrollY.current = scrollY;

      if (isAnimating || isScrolling.current) return;

      const heroRect = heroRef.current?.getBoundingClientRect();
      const airMaxRect = airMaxRef.current?.getBoundingClientRect();

      if (!heroRect || !airMaxRect) return;

      const heroBottom = heroRect.bottom;
      const viewportHeight = window.innerHeight;

      // Trigger scroll-down when hero section's bottom is near viewport top
      if (direction === "down" && activeSection === "hero" && heroBottom <= viewportHeight * 0.9) {
        animateScroll("down");
      } else if (direction === "up" && activeSection === "airmax" && airMaxRect.top >= viewportHeight * 0.2) {
        animateScroll("up");
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

  // Animation variants for hero image
  const imageVariants = {
    scrollDown: {
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
    scrollUp: {
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
      rotate: -2,
      filter: "blur(0px) brightness(1.15)",
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <>
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className={cn(
          "min-h-screen flex items-center justify-center relative overflow-hidden",
          "pt-8 lg:pt-0 text-white px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900/90 to-transparent"
        )}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 z-0 backdrop-blur-sm bg-gradient-to-br from-[rgba(10,10,10,0.7)] to-[rgba(10,10,10,0.2)]"
          initial={{ backgroundColor: colorThemes[selectedColor] }}
          animate={{ backgroundColor: colorThemes[selectedColor] }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Particle System */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -40 + 20, 0],
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

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-[80vh]">
              {/* Left Content */}
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
                    onClick={() => animateScroll("down")}
                    className="bg-white text-black px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Discover AirMax
                  </Button>
                </motion.div>

                {/* Color Selector */}
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

              {/* Center Image */}
              <div className="col-span-1 lg:col-span-7 relative flex justify-center items-center">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
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

                <motion.div
                  className="relative cursor-pointer group"
                  variants={imageVariants}
                  initial="normal"
                  animate={
                    isAnimating && scrollDirection === "down" && activeSection === "hero"
                      ? "scrollDown"
                      : isAnimating && scrollDirection === "up" && activeSection === "airmax"
                      ? "scrollUp"
                      : "normal"
                  }
                  whileHover="hover"
                  onClick={() => animateScroll("down")}
                  style={{ willChange: "transform, opacity, filter" }}
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
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

                  {/* Scroll Hint */}
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
                    <span>Scroll to bottom</span>
                  </motion.div>
                </motion.div>

                {/* Navigation */}
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

            {/* Scroll Indicator */}
            {activeSection === "hero" && !isAnimating && (
              <motion.div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/85 cursor-pointer"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                onClick={() => animateScroll("down")}
              >
                <motion.div
                  className="backdrop-blur-md bg-white/20 px-3 py-2 rounded-full border border-white/25 hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.15, rotate: 180 }}
                >
                  <ArrowDown className="w-5 h-5" />
                </motion.div>
                <motion.span className="text-xs font-medium bg-white/15 backdrop-blur-md px-3 py-1 rounded-full" whileHover={{ scale: 1.15 }}>
                  Scroll to bottom
                </motion.span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* AirMax Section */}
      <div ref={airMaxRef}>
        <AirMaxSection
          activeSection={activeSection}
          isAnimating={isAnimating}
          scrollDirection={scrollDirection}
          backgroundColor={colorThemes[selectedColor]}
          productImage={imageSrc}
          currentProduct={currentProduct}
          onScrollUp={() => animateScroll("up")}
        />
      </div>
    </>
  );
};

// AirMax Section Component
interface AirMaxSectionProps {
  activeSection: "hero" | "airmax";
  isAnimating: boolean;
  scrollDirection: "up" | "down";
  backgroundColor: string;
  productImage: string;
  currentProduct: Product;
  onScrollUp: () => void;
}

const AirMaxSection: React.FC<AirMaxSectionProps> = ({
  activeSection,
  isAnimating,
  scrollDirection,
  backgroundColor,
  productImage,
  currentProduct,
  onScrollUp,
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
      className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-tl from-gray-900/90 to-transparent"
      style={{ backgroundColor }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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

      {/* Scroll Up Button */}
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
              ? "scrollUpExit"
              : "normal"
          }
          whileHover="hover"
          onClick={onScrollUp}
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
            <ArrowUp className="w-4 h-4 animate-pulse" />
            <span>Scroll to top</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
