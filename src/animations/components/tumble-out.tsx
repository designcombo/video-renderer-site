'use client';
import React, { useEffect } from 'react';
import { Timeline } from '../../lib/anime/anime';
import './style.css';
interface AnimatedLetterProps {
  timeLine: Timeline;
  from: number;
  to: number;
  children: React.ReactNode;
  id: string;
}
const TumbleOutAnimation: React.FC<AnimatedLetterProps> = ({
  timeLine,
  from,
  to,
  children,
  id,
}) => {
  useEffect(() => {
    timeLine.add(
      `#${id}.ml31`,
      {
        translateY: { from: '0%', to: '-100%' },
        translateX: { from: '0%', to: '120%' },
        rotate: { from: 0, to: 60 },
        opacity: { from: 1, to: 0 },
        ease: 'outExpo',
        duration: 1000,
        delay: to - 1200,
      },
      0,
    );
  }, [timeLine, from, to]);
  return (
    <div className="containerAnimation">
      <div className="ml31" id={id}>
        {children}
      </div>
    </div>
  );
};

export default TumbleOutAnimation;
