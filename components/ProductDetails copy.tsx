"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AirMaxComponent() {
  return (
    <div className="min-h-screen bg-white relative flex items-center justify-center p-4 overflow-hidden">
      {/* Shoe Image - Adjusted for mobile */}
      <motion.div
        className="absolute inset-0 z-0 flex justify-center lg:justify-end items-center"
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="relative w-full h-[40vh] sm:h-[50vh] lg:h-[80vh] lg:w-[70vw]">
          <Image
            src="/images/jordan-blue.png"
            alt="Nike Airmax 270"
            fill
            className="object-contain drop-shadow-2xl"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 50vw"
          />
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Side - Text - REMOVED excessive top margin */}
        <motion.div
          className="space-y-4 text-center lg:text-left
                     mt-[45vh] sm:mt-[55vh] lg:mt-0
                     px-4 sm:px-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-black leading-none tracking-tight">
            Airmax
          </h1>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-black leading-none tracking-tight">
            Nike
          </h2>
          <h3 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-black leading-none tracking-tight">
            270
          </h3>

          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-sm mx-auto lg:mx-0 leading-relaxed pt-2 lg:pt-4">
            The Nike Air Max 270 combines the exaggerated tongue from the Air
            Max 180 and classic elements from the Air Max 93. Built for all-day
            comfort with an Air unit that's impossible to ignore.
          </p>

          {/* Buy Now Button */}
          <motion.div
            className="pt-4 lg:pt-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="#"
              className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-900 transition shadow-lg"
            >
              Buy now
            </Link>
          </motion.div>

          {/* Progress Dots */}
          <div className="flex justify-center lg:justify-start items-center space-x-2 pt-4 lg:pt-6">
            <motion.div 
              className="w-8 h-1 bg-black cursor-pointer"
              whileHover={{ scale: 1.1 }}
            />
            <motion.div 
              className="w-4 h-1 bg-gray-300 cursor-pointer"
              whileHover={{ scale: 1.1 }}
            />
            <motion.div 
              className="w-4 h-1 bg-gray-300 cursor-pointer"
              whileHover={{ scale: 1.1 }}
            />
          </div>
        </motion.div>

        {/* Empty right side for spacing on large screens */}
        <div className="hidden lg:block"></div>
      </div>
    </div>
  );
}