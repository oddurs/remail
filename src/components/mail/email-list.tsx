"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerItem, DURATION, EASE } from "@/lib/animations";

export function AnimatedList({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {children}
    </motion.div>
  );
}

export function AnimatedRow({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={staggerItem}
      transition={{ duration: DURATION.fast, ease: EASE.default }}
    >
      {children}
    </motion.div>
  );
}
