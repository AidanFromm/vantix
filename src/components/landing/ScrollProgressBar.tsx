'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { colors } from '@/lib/design-tokens';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
      style={{
        scaleX,
        background: `linear-gradient(90deg, ${colors.bronze}, ${colors.bronzeLight})`,
      }}
    />
  );
}
