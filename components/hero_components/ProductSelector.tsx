"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { HeroSectionProps } from "./HeroSection";

const ProductSelector = (props: HeroSectionProps) => {
  const { productData, selectedProduct, onProductChange, onColorChange, onImageIndexChange } = props;

  return (
    <motion.div className="flex flex-row lg:flex-col gap-4 items-start self-start">
      {(Object.keys(productData) as string[])
        .filter((key) => key !== selectedProduct)
        .map((key) => (
          <motion.button
            key={key}
            initial={{ scale: 0.8, opacity: 0, x: 20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            onClick={() => {
              onProductChange(key as any);
              onColorChange(key as any);
              onImageIndexChange(0);
            }}
            className={`relative w-24 h-16 lg:w-28 lg:h-20 rounded-xl overflow-hidden border-2 transition-all ${
              selectedProduct === key
                ? "border-white scale-110 shadow-lg shadow-white/20"
                : "border-gray-700 hover:border-white"
            } group`}
          >
            <Image
              src={productData[key as any].images[0]}
              alt={productData[key as any].name}
              fill
              sizes="(max-width: 640px) 80px, 120px"
              className="object-cover transition-transform group-hover:scale-110"
            />
          </motion.button>
        ))}
    </motion.div>
  );
};

export default ProductSelector;
