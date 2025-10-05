"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import HeroSection from "./HeroSection";
import AirMaxSection from "./AirMaxSection";
import ShoeCard from "./ShoeCard";

type ProductColor = "black" | "red";

interface Product {
  name: string;
  images: string[];
  releaseDate: string;
  colorWay: string;
}

interface ColorTheme {
  bg: string;
  gradient: string;
  text: string;
}

const Hero: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductColor>("black");
  const [selectedColor, setSelectedColor] = useState<ProductColor>("black");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSection, setActiveSection] = useState<"hero" | "airmax" | "shoecard">("hero");
  const [showPreview, setShowPreview] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const airMaxRef = useRef<HTMLDivElement>(null);
  const shoeCardRef = useRef<HTMLDivElement>(null);
  const lastTouchY = useRef<number | null>(null);
  const isScrolling = useRef(false);
  const scrollEndTimeout = useRef<NodeJS.Timeout | null>(null);

  const ANIMATION_DURATION = 500;

  const colorThemes: Record<ProductColor, ColorTheme> = {
    black: { bg: "#0a0a0a", gradient: "from-gray-900/90 to-gray-800/90", text: "text-white" },
    red: { bg: "#9b1b1b", gradient: "from-red-900/90 to-red-700/90", text: "text-white" },
  };

  const productData: Record<ProductColor, Product> = {
    black: {
      name: "AIR MAX 270",
      images: ["/images/nike1.png", "/images/nike2.png", "/images/nike3.png", "/images/nike1.png"],
      releaseDate: "2016-10-06",
      colorWay: "SAIL/STARFISH-BLACK",
    },
    red: {
      name: "AIR MAX 90",
      images: ["/images/nike2.png", "/images/nike1.png", "/images/nike3.png", "/images/nike1.png"],
      releaseDate: "2025-10-06",
      colorWay: "SAIL/SCARLET-RED",
    },
  };

  // Memoize current product and color theme
  const currentProduct = useMemo(() => productData[selectedProduct], [selectedProduct]);
  const currentColorTheme = useMemo(() => colorThemes[selectedColor], [selectedColor]);
  
  // Memoize imageSrc to ensure it updates with currentImageIndex and currentProduct
  const imageSrc = useMemo(
    () => currentProduct.images[currentImageIndex] || "",
    [currentProduct, currentImageIndex]
  );

  // Handle image navigation
  const handleNext = useCallback(() => {
    if (currentProduct.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === currentProduct.images.length - 1 ? 0 : prev + 1
    );
  }, [currentProduct.images.length]);

  const handlePrev = useCallback(() => {
    if (currentProduct.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentProduct.images.length - 1 : prev - 1
    );
  }, [currentProduct.images.length]);

  // Scroll animation logic
  const animateScroll = useCallback((direction: "up" | "down") => {
    if (isAnimating || isScrolling.current) return;
    setIsAnimating(true);
    isScrolling.current = true;
    setIsTransitioning(true);

    let targetSection: "hero" | "airmax" | "shoecard" = activeSection;
    if (direction === "down") {
      if (activeSection === "hero") targetSection = "airmax";
      else if (activeSection === "airmax") targetSection = "shoecard";
    } else {
      if (activeSection === "shoecard") targetSection = "airmax";
      else if (activeSection === "airmax") targetSection = "hero";
    }

    const targetRef =
      targetSection === "hero"
        ? heroRef
        : targetSection === "airmax"
        ? airMaxRef
        : shoeCardRef;

    const targetRect = targetRef.current?.getBoundingClientRect();
    if (targetRect) {
      window.scrollTo({
        top: window.scrollY + targetRect.top,
        behavior: "smooth",
      });

      const checkScrollEnd = () => {
        const targetScrollY = window.scrollY + targetRect.top;
        if (Math.abs(window.scrollY - targetScrollY) < 5) {
          setActiveSection(targetSection);
          setShowPreview(false);
          setIsTransitioning(false);
          if (scrollEndTimeout.current) clearTimeout(scrollEndTimeout.current);
        } else {
          requestAnimationFrame(checkScrollEnd);
        }
      };
      requestAnimationFrame(checkScrollEnd);

      scrollEndTimeout.current = setTimeout(() => {
        setActiveSection(targetSection);
        setShowPreview(false);
        setIsTransitioning(false);
      }, ANIMATION_DURATION * 1.5);
    }

    setTimeout(() => {
      setIsAnimating(false);
      isScrolling.current = false;
      if (scrollEndTimeout.current) clearTimeout(scrollEndTimeout.current);
    }, ANIMATION_DURATION * 2);
  }, [activeSection, isAnimating]);

  // Handle wheel and touch events
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (activeSection === "hero" || (e.deltaY > 0 && (activeSection === "airmax" || activeSection === "shoecard"))) {
        e.preventDefault();
        return false;
      }
    },
    [activeSection]
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    lastTouchY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!lastTouchY.current) return;
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY.current - currentY;

      if (activeSection === "hero" || (deltaY > 0 && (activeSection === "airmax" || activeSection === "shoecard"))) {
        e.preventDefault();
      }
    },
    [activeSection]
  );

  // Reset scroll on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveSection("hero");
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Add event listeners
  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove]);

  // FIXED: Only reset image index when product changes, NOT when section changes
  useEffect(() => {
    // Reset to first image only when product changes
    setCurrentImageIndex(0);
  }, [selectedProduct]); // Only depend on selectedProduct

  // Handle image click for navigation
  const handleImageClick = useCallback(() => {
    if (activeSection === "hero" || activeSection === "airmax") {
      setShowPreview(true);
      setIsTransitioning(true);
      animateScroll("down");
    }
  }, [activeSection, animateScroll]);

  const handleCloseModal = useCallback(() => {
    setShowPreview(false);
    if (activeSection === "airmax" || activeSection === "shoecard") {
      animateScroll("up");
    }
  }, [activeSection, animateScroll]);

  // Debug logging for image updates
  useEffect(() => {
    console.log("Image updated:", { 
      selectedProduct, 
      currentImageIndex, 
      imageSrc, 
      activeSection,
      totalImages: currentProduct.images.length 
    });
  }, [imageSrc, selectedProduct, currentImageIndex, activeSection, currentProduct.images.length]);

  return (
    <div  >
      <HeroSection
        ref={heroRef}
        selectedProduct={selectedProduct}
        selectedColor={selectedColor}
        currentProduct={currentProduct}
        currentImageIndex={currentImageIndex}
        imageSrc={imageSrc} // Explicitly pass imageSrc
        colorThemes={colorThemes}
        productData={productData}
        isAnimating={isAnimating}
        activeSection={activeSection}
        currentColorTheme={currentColorTheme}
        onProductChange={setSelectedProduct}
        onColorChange={setSelectedColor}
        onImageIndexChange={setCurrentImageIndex}
        onNextImage={handleNext}
        onPrevImage={handlePrev}
        showPreview={showPreview}
        isTransitioning={isTransitioning}
        onImageClick={handleImageClick}
        onCloseModal={handleCloseModal}
        onScrollDown={() => animateScroll("down")}
      />
      <div ref={airMaxRef}>
        <AirMaxSection
          activeSection={activeSection}
          isAnimating={isAnimating}
          currentColorTheme={currentColorTheme}
          productImage={imageSrc} // Use imageSrc directly
          currentProduct={currentProduct}
          selectedProduct={selectedProduct}
          currentImageIndex={currentImageIndex}
          onScrollUp={() => animateScroll("up")}
          onScrollDown={() => animateScroll("down")}
          onImageClick={handleImageClick}
          showPreview={showPreview}
          onCloseModal={handleCloseModal}
        />
      </div>
      <div ref={shoeCardRef}>
        <ShoeCard
          activeSection={activeSection}
          isAnimating={isAnimating}
          currentColorTheme={currentColorTheme}
          productImage={imageSrc} // Use imageSrc directly
          currentProduct={currentProduct}
          onScrollUp={() => animateScroll("up")}
          setShowPreview={setShowPreview}
        />
      </div>
    </div>
  );
};

export default Hero;