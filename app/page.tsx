"use client"
import { useState, useEffect, createContext, useContext } from "react";
import Hero from '@/components/Hero'
import ProductDetails from '@/components/ProductDetails'
import React from 'react'
import { AnimatePresence } from "framer-motion";
import ShoeCard from "@/components/ShoeCard";
import PathAnimation from "@/components/PathAnimation";

const HomePage = () => {
  const [showAirMax, setShowAirMax] = useState(false);
  return (
    <div>
      <Hero/>
      {/* <ProductDetails/> */}
      {/* <ShoeCard/> */}

    </div>
  )
}

export default HomePage
