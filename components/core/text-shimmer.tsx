'use client';
import React, { useMemo, JSX } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/utils';

export interface TextShimmerProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
}

export function TextShimmer({
  children,
  as: Component = 'p',
  className,
  duration = 2,
}: TextShimmerProps) {
  const MotionComponent = motion(Component as React.ElementType);

  return (
    <MotionComponent
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent [--bg-size:300%]',
        '[background-image:linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,1)_100%)]',
        'dark:[background-image:linear-gradient(90deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,1)_50%,rgba(255,255,255,0.4)_100%)]',
        className
      )}
      initial={{ backgroundPosition: '200% center' }}
      animate={{ backgroundPosition: '-200% center' }}
      transition={{
        repeat: Infinity,
        duration: duration,
        ease: 'linear',
      }}
    >
      {children}
    </MotionComponent>
  );
}
