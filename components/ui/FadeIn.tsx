"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      // Keep server-rendered content visible, including before hydration and
      // when a reduced-motion preference disables entrance animation.
      initial={false}
      whileInView={reduceMotion ? { opacity: 1, y: 0 } : { opacity: [0.75, 1], y: [16, 0] }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
