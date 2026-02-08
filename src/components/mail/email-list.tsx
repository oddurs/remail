"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerItem, DURATION, EASE } from "@/lib/animations";

export function AnimatedList({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={staggerContainer} initial="initial" animate="animate">
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
