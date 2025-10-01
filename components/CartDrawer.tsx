
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, X, Heart, Trash2, ChevronRight, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

interface ColorTheme {
  bg: string;
  gradient: string;
  text: string;
}

interface CartItem {
  id: string;
  name: string;
  size: string;
  originalPrice: string;
  discountedPrice: string;
  image: string;
  quantity: number;
}

interface CartDrawerProps {
  currentColorTheme: ColorTheme;
}

const ANIMATION_DURATION = 500; // ms, synced with Header, AirMaxSection, ShoeCard
const ANIMATION_DURATION_S = ANIMATION_DURATION / 1000;

const CartDrawer: React.FC<CartDrawerProps> = ({ currentColorTheme }) => {
  const [timeLeft, setTimeLeft] = useState(137); // 2 minutes 17 seconds
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Full Leg Compression Massager",
      size: "US",
      originalPrice: "$225.00",
      discountedPrice: "$145.00",
      image: "https://placehold.co/80x80/EFEFEF/text?text=Product",
      quantity: 1,
    },
  ]);

  const isMobile = useMemo(() => typeof window !== "undefined" && window.innerWidth < 768, []);

  // Particle system
  const particlePositions = useMemo(
    () =>
      [...Array(isMobile ? 4 : 8)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: Math.random() * 2 + 1.5,
        delay: Math.random() * 0.8,
        yOffset: Math.random() * 20 - 10,
        opacityRange: Math.random() * 0.3 + 0.2,
        scaleRange: Math.random() * 0.4 + 0.5,
      })),
    [isMobile]
  );

  useEffect(() => {
    if (isSheetOpen) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSheetOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const handleOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (open) {
      setTimeLeft(137); // Reset timer
    }
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  // Animation variants
  const sheetVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: ANIMATION_DURATION_S, type: "spring", stiffness: 120, damping: 12 } },
    exit: { x: "100%", opacity: 0, transition: { duration: ANIMATION_DURATION_S * 0.8, ease: "easeInOut" } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.1, duration: ANIMATION_DURATION_S, type: "spring", stiffness: 120, damping: 12 },
    }),
  };

  const progressBarVariants = {
    initial: { width: 0 },
    animate: { width: "50%", transition: { duration: 1, ease: "easeOut", delay: 0.3 } },
  };

  const timerVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.5, type: "spring", stiffness: 120, delay: 0.5 } },
  };

  return (
    <Sheet onOpenChange={handleOpenChange}>
      {/* Trigger - Shopping Cart Button */}
      <SheetTrigger asChild>
        <motion.button
          className="relative p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.1, boxShadow: "0 8px 16px rgba(255,255,255,0.2)" }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart className="h-5 w-5 text-white" />
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-semibold">
            {cartItems.length}
          </span>
        </motion.button>
      </SheetTrigger>

      {/* Drawer Content */}
      <SheetContent
        side="right"
        className={`w-[90vw] sm:w-[450px] p-0 flex flex-col font-sans bg-${currentColorTheme.bg}/20 backdrop-blur-md border-l border-white/20`}
      >
        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{ left: pos.left, top: pos.top }}
              animate={{
                y: [0, pos.yOffset, 0],
                opacity: [0, pos.opacityRange, 0],
                scale: [0, pos.scaleRange, 0],
              }}
              transition={{
                duration: pos.duration,
                repeat: Infinity,
                delay: pos.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between px-4 py-3 border-b border-white/20 bg-white/10 backdrop-blur-md">
          <SheetTitle className="text-base sm:text-lg font-extrabold text-white">
            Cart • {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </SheetTitle>
          <SheetClose asChild>
            <motion.button
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-5 w-5" />
            </motion.button>
          </SheetClose>
        </SheetHeader>

        {/* Progress Bar Discount Section */}
        <motion.div
          className="px-4 py-3 border-b border-white/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION_DURATION_S, type: "spring", stiffness: 120, delay: 0.2 }}
        >
          <p className="text-xs sm:text-sm font-medium text-center text-gray-200">
            You’re 1 away from a <span className="text-orange-500 font-bold">40% discount!</span>
          </p>
          <div className="relative flex items-center justify-between mt-3">
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200/30"
              variants={progressBarVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div className="h-full bg-gradient-to-r from-orange-500 to-orange-400" variants={progressBarVariants} />
            </motion.div>
            <div className="flex w-full justify-between z-10">
              {["40%", "50%", "60%"].map((percent, index) => (
                <div key={index} className="flex flex-col items-center">
                  <motion.div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 bg-white/90 flex items-center justify-center ${
                      index === 0 ? "border-orange-500" : "border-gray-300"
                    }`}
                    whileHover={{ scale: 1.1, boxShadow: "0 4px 8px rgba(255,255,255,0.2)" }}
                  >
                    <ShoppingBag
                      size={isMobile ? 14 : 16}
                      className={`${index === 0 ? "text-orange-500" : "text-gray-400"}`}
                    />
                  </motion.div>
                  <span className="mt-1 text-[10px] sm:text-xs font-semibold text-gray-300">{percent} OFF</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Cart Items */}
        <div className="px-4 py-4 flex-1 overflow-y-auto">
          {cartItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex items-start space-x-2 border border-white/20 rounded-lg p-2 relative bg-white/5 backdrop-blur-md mb-3"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <div className="relative">
                <img
                  src={imageError ? "/images/fallback-product.png" : item.image}
                  alt={item.name}
                  width={isMobile ? 64 : 80}
                  height={isMobile ? 64 : 80}
                  className="rounded-md border border-white/20"
                  onError={() => setImageError(true)}
                />
                <span className="absolute top-1 left-1 bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1 py-[1px] rounded">
                  SALE
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-semibold text-white">{item.name}</h3>
                <p className="text-[10px] sm:text-xs text-gray-300">{item.size}</p>
                <div className="flex items-center space-x-1 mt-2 border border-white/20 rounded-md w-fit bg-white/10">
                  <motion.button
                    className="px-1.5 py-1 text-gray-300 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    -
                  </motion.button>
                  <span className="text-xs text-white">{item.quantity}</span>
                  <motion.button
                    className="px-1.5 py-1 text-gray-300 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </motion.button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] sm:text-xs text-gray-400 line-through">{item.originalPrice}</p>
                <p className="text-sm sm:text-lg font-bold text-orange-500">{item.discountedPrice}</p>
                <motion.button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 size={14} />
                </motion.button>
              </div>
            </motion.div>
          ))}
          {/* Trust Badges */}
          <motion.div
            className="grid grid-cols-3 gap-2 sm:gap-4 text-center mt-6 text-[10px] sm:text-xs font-medium text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: ANIMATION_DURATION_S, type: "spring", stiffness: 120 }}
          >
            <div>
              <span className="text-lg sm:text-xl">🚚</span>
              <p className="mt-1">Tracked <br /> Insured Shipping</p>
            </div>
            <div>
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mx-auto" />
              <p className="mt-1">200k+ Happy <br /> Customers</p>
            </div>
            <div>
              <span className="text-lg sm:text-xl">💰</span>
              <p className="mt-1">100% Money <br /> Back Guarantee</p>
            </div>
          </motion.div>
        </div>

        {/* Timer Section */}
        <motion.div
          className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 text-white text-center py-2 text-xs sm:text-sm font-medium backdrop-blur-md"
          variants={timerVariants}
          initial="initial"
          animate="animate"
        >
          Cart reserved for <motion.span className="font-bold" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: Infinity }}>
            {formatTime(timeLeft)}
          </motion.span>{" "}
          more minutes!
        </motion.div>

        {/* Footer */}
        <motion.div
          className="border-t border-white/20 p-4 bg-white/5 backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION_DURATION_S, type: "spring", stiffness: 120, delay: 0.3 }}
        >
          <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-200">
            <span>You Save</span>
            <span className="text-orange-500 font-bold">$80.00</span>
          </div>
          <div className="flex justify-between text-base sm:text-xl font-bold text-white mt-1">
            <span>Total</span>
            <span>$145.00</span>
          </div>
          <motion.button
            className="mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 rounded-lg font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              CHECKOUT
              <ChevronRight className="h-5 w-5" />
            </span>
          </motion.button>
          {/* Payment Icons */}
          <motion.div
            className="flex justify-center items-center space-x-2 sm:space-x-3 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: ANIMATION_DURATION_S }}
          >
            {[
              "https://img.icons8.com/color/48/visa.png",
              "https://img.icons8.com/color/48/mastercard.png",
              "https://img.icons8.com/color/48/paypal.png",
              "https://img.icons8.com/color/48/shop-pay.png",
              "https://img.icons8.com/color/48/apple-pay.png",
              "https://img.icons8.com/color/48/google-pay.png",
            ].map((src, index) => (
              <motion.img
                key={index}
                src={src}
                alt="Payment method"
                className="h-5 sm:h-6 w-auto"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </motion.div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
