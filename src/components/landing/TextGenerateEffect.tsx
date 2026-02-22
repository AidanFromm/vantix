'use client';

import { motion } from 'framer-motion';

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  speed?: number;
}

export default function TextGenerateEffect({
  words,
  className = '',
  speed = 0.05,
}: TextGenerateEffectProps) {
  const wordArray = words.split(' ');

  return (
    <span className={className}>
      {wordArray.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * speed, duration: 0.4, ease: 'easeOut' }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
