"use client";

import { ShoppingBag, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

// Define navigation items with types
interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "New Releases", href: "/new-releases" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Kids", href: "/kids" },
  { label: "Customize", href: "/customize" },
];

// Animation variants for header
const headerVariants: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

// Animation variants for nav items
const navItemVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: (index: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.15 * index, duration: 0.5, ease: "easeOut" },
  }),
  hover: {
    scale: 1.05,
    color: "#f59e0b", // Amber accent for hover
    transition: { duration: 0.3 },
  },
};

// Animation variants for icons
const iconVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.15,
    rotate: 5,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [cartCount] = useState<number>(1); // Example cart count state

  // Scroll-based animation for header background opacity
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 100], [0.4, 0.9]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-gray-950/40 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.2)] border-b border-white/10"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      style={{ backgroundColor: useTransform(backgroundOpacity, (value) => `rgba(17, 24, 39, ${value})`) }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <motion.div
          className="flex-shrink-0"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <Link href="/" aria-label="Home">
            <img
              src="/logo.png"
              alt="Brand Logo"
              className="w-14 h-14 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              onError={(e) => (e.currentTarget.src = "/fallback-logo.png")} // Fallback image
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 bg-white/5 backdrop-blur-lg rounded-full px-8 py-3 border border-white/10">
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              custom={index}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <Link
                href={item.href}
                className="text-white text-sm font-playfair font-medium  tracking-wider hover:text-amber-400 transition-colors duration-300"
                aria-label={item.label}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/10"
          aria-label="Toggle Menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* User & Cart */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          {/* User */}
          <motion.div variants={iconVariants} whileHover="hover">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
              aria-label="User Profile"
            >
              <User className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* Shopping Cart */}
          <motion.div variants={iconVariants} whileHover="hover" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
              aria-label={`Shopping Cart with ${cartCount} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {cartCount}
                </motion.span>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <motion.nav
        className="md:hidden bg-white/10 backdrop-blur-lg border-t border-white/10"
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isMenuOpen ? "auto" : 0,
          opacity: isMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        <div className="flex flex-col items-center gap-4 py-4">
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              custom={index}
              variants={navItemVariants}
              initial="hidden"
              animate={isMenuOpen ? "visible" : "hidden"}
            >
              <Link
                href={item.href}
                className="text-white text-base font-medium uppercase tracking-wide hover:text-amber-400 transition-colors duration-300"
                aria-label={item.label}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.nav>
    </motion.header>
  );
};

export default Header;