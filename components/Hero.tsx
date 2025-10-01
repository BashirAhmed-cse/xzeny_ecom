
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
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
  const [selectedProduct, setSelectedProduct] = useState<ProductColor>("red");
  const [selectedColor, setSelectedColor] = useState<ProductColor>("red");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSection, setActiveSection] = useState<"hero" | "airmax" | "shoecard">("hero");
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [showPreview, setShowPreview] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const airMaxRef = useRef<HTMLDivElement>(null);
  const shoeCardRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const isScrolling = useRef(false);

  const ANIMATION_DURATION = 500; // Synced with AirMaxSection, ShoeCard

  const colorThemes: Record<ProductColor, ColorTheme> = {
    black: { bg: "#0a0a0a", gradient: "from-gray-900/90 to-gray-800/90", text: "text-white" },
    red: { bg: "#9b1b1b", gradient: "from-red-900/90 to-red-700/90", text: "text-white" },
  };

  const productData: Record<ProductColor, Product> = {
    black: {
      name: "AIR MAX 270",
      images: ["/images/jordan-blue.png","/images/jordan-green2.png", "/images/jordan-blue2.png","/images/jordan-green2.png"],
      releaseDate: "2016-10-06",
      colorWay: "SAIL/STARFISH-BLACK",
    },
    red: {
      name: "AIR MAX 90",
      images: ["/images/jordan-red.png","/images/jordan-blue2.png", "/images/jordan-red2.png","/images/jordan-blue2.png",],
      releaseDate: "2025-10-06",
      colorWay: "SAIL/SCARLET-RED",
    },
  };

  const currentProduct = useMemo(() => productData[selectedProduct], [selectedProduct]);
  const currentColorTheme = useMemo(() => colorThemes[selectedColor], [selectedColor]);
  const imageSrc = currentProduct.images[currentImageIndex] || "";

  const handleNext = () => {
    if (currentProduct.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === currentProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    if (currentProduct.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentProduct.images.length - 1 : prev - 1
    );
  };

  const animateScroll = (direction: "up" | "down") => {
    if (isAnimating || isScrolling.current) return;
    setIsAnimating(true);
    setScrollDirection(direction);
    isScrolling.current = true;

    let targetSection: "hero" | "airmax" | "shoecard" = activeSection;
    if (direction === "down") {
      if (activeSection === "hero") targetSection = "airmax";
      else if (activeSection === "airmax") targetSection = "shoecard";
    } else {
      if (activeSection === "shoecard") targetSection = "airmax";
      else if (activeSection === "airmax") targetSection = "hero";
    }

    setActiveSection(targetSection);

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
    }

    setTimeout(() => {
      setIsAnimating(false);
      isScrolling.current = false;
      if (targetSection === "airmax") {
        console.log("Closing modal after scroll to AirMaxSection");
        setShowPreview(false); // Close modal after scroll completes
      }
    }, ANIMATION_DURATION);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY.current ? "down" : "up";
      lastScrollY.current = scrollY;

      if (isAnimating || isScrolling.current) return;

      const heroRect = heroRef.current?.getBoundingClientRect();
      const airMaxRect = airMaxRef.current?.getBoundingClientRect();
      const shoeCardRect = shoeCardRef.current?.getBoundingClientRect();
      if (!heroRect || !airMaxRect || !shoeCardRect) return;

      const viewportHeight = window.innerHeight;

      if (direction === "down") {
        if (activeSection === "hero" && heroRect.bottom <= viewportHeight * 0.8) {
          animateScroll("down");
        } else if (activeSection === "airmax" && airMaxRect.bottom <= viewportHeight * 0.8) {
          animateScroll("down");
        }
      } else {
        if (activeSection === "shoecard" && shoeCardRect.top >= viewportHeight * 0.2) {
          animateScroll("up");
        } else if (activeSection === "airmax" && airMaxRect.top >= viewportHeight * 0.2) {
          animateScroll("up");
        }
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

    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [activeSection, isAnimating]);

  const handleHeroImageClick = () => {
    console.log("Opening modal: showPreview = true");
    setShowPreview(true);
    setTimeout(() => {
      console.log("Triggering scroll to AirMaxSection");
      animateScroll("down"); // Delay scroll to allow modal to render
    }, 100); // Short delay for modal visibility
  };

  return (
    <>
      <HeroSection
        ref={heroRef}
        selectedProduct={selectedProduct}
        selectedColor={selectedColor}
        currentProduct={currentProduct}
        currentImageIndex={currentImageIndex}
        colorThemes={colorThemes}
        productData={productData}
        isAnimating={isAnimating}
        scrollDirection={scrollDirection}
        activeSection={activeSection}
        currentColorTheme={currentColorTheme}
        onProductChange={setSelectedProduct}
        onColorChange={setSelectedColor}
        onImageIndexChange={setCurrentImageIndex}
        onNextImage={handleNext}
        onPrevImage={handlePrev}
        onScrollDown={() => animateScroll("down")}
        showPreview={showPreview}
        onImageClick={handleHeroImageClick}
      />
      <div ref={airMaxRef}>
        <AirMaxSection
          activeSection={activeSection}
          isAnimating={isAnimating}
          scrollDirection={scrollDirection}
          currentColorTheme={currentColorTheme}
          productImage={imageSrc}
          currentProduct={currentProduct}
          onScrollUp={() => animateScroll("up")}
          onScrollDown={() => animateScroll("down")}
          setShowPreview={setShowPreview}
        />
      </div>
      <div ref={shoeCardRef}>
        <ShoeCard
          activeSection={activeSection}
          isAnimating={isAnimating}
          scrollDirection={scrollDirection}
          currentColorTheme={currentColorTheme}
          productImage={imageSrc}
          currentProduct={currentProduct}
          onScrollUp={() => animateScroll("up")}
          setShowPreview={setShowPreview}
        />
      </div>
    </>
  );
};

export default Hero;
