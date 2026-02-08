export const DURATION = { fast: 0.15, normal: 0.2, slow: 0.3 };

export const EASE = {
  default: [0.25, 0.1, 0.25, 1] as const,
  spring: { type: "spring" as const, stiffness: 400, damping: 25 },
};

// Reusable variants
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const slideUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

export const slideDown = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

// Stagger parent
export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.03 } },
};

export const staggerItem = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
};
