"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
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

  // Enhanced scroll animation for 3 sections
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
    setTimeout(() => {
      let targetRef: React.RefObject<HTMLDivElement> | null = null;
      if (targetSection === "hero") targetRef = heroRef;
      else if (targetSection === "airmax") targetRef = airMaxRef;
      else if (targetSection === "shoecard") targetRef = shoeCardRef;

      if (targetRef?.current) {
        targetRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      setTimeout(() => {
        setIsAnimating(false);
        isScrolling.current = false;
      }, 700);
    }, 50);
  };

  // Scroll detection for 3 sections
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

      // Scroll down logic
      if (direction === "down") {
        if (activeSection === "hero" && heroRect.bottom <= viewportHeight * 0.8) {
          animateScroll("down");
        } else if (activeSection === "airmax" && airMaxRect.bottom <= viewportHeight * 0.8) {
          animateScroll("down");
        }
      }
      // Scroll up logic
      else {
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

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [activeSection, isAnimating]);

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
        onProductChange={setSelectedProduct}
        onColorChange={setSelectedColor}
        onImageIndexChange={setCurrentImageIndex}
        onNextImage={handleNext}
        onPrevImage={handlePrev}
        onScrollDown={() => animateScroll("down")}
      />

      <div ref={airMaxRef}>
        <AirMaxSection
          activeSection={activeSection}
          isAnimating={isAnimating}
          scrollDirection={scrollDirection}
          backgroundColor={colorThemes[selectedColor]}
          productImage={imageSrc}
          currentProduct={currentProduct}
          onScrollUp={() => animateScroll("up")}
          onScrollDown={() => animateScroll("down")}
        />
      </div>

      <div ref={shoeCardRef}>
        <ShoeCard
          activeSection={activeSection}
          isAnimating={isAnimating}
          scrollDirection={scrollDirection}
          onScrollUp={() => animateScroll("up")}
        />
      </div>
    </>
  );
};

export default Hero;