"use client";

import { motion } from "framer-motion";

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  distance = 50,
}) {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    fade: { opacity: 0 },
  };

  const initial = directions[direction] || directions.up;

  if (direction === "fade") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{
          duration: duration,
          delay: delay,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...initial,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
