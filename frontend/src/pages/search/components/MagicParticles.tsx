// D:\Spotifyz\frontend\src\pages\search\components\MagicParticles.tsx
import { CSSProperties } from "react";

interface MagicParticlesProps {
  show: boolean;
  position: { x: number, y: number };
}

const MagicParticles = ({ show, position }: MagicParticlesProps) => {
  if (!show) return null;
  
  return (
    <div className="particles-container absolute inset-0 pointer-events-none z-20">
      {Array.from({ length: 30 }).map((_, i) => {
        const style: CSSProperties = {
          left: `${position.x || Math.random() * window.innerWidth}px`,
          top: `${position.y || Math.random() * 200}px`,
          animationDuration: `${Math.random() * 2 + 1}s`,
          width: `${Math.random() * 10 + 5}px`,
          height: `${Math.random() * 10 + 5}px`
        };
        
        return (
          <div 
            key={i} 
            className="magic-particle" 
            style={style}
          />
        );
      })}
    </div>
  );
};

export default MagicParticles;