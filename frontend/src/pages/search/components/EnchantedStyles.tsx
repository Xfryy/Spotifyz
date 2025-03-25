// D:\Spotifyz\frontend\src\pages\search\components\EnchantedStyles.tsx
const EnchantedStyles = () => {
    return (
      <style>{`
        /* Magical glowing text */
        .enchanted-text {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .enchanted-text.enchanted-active {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Magical searchbar effects */
        .enchanted-searchbar {
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
          transition: box-shadow 0.5s ease;
        }
        
        .enchanted-searchbar:hover {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.2);
        }
        
        .enchanted-glow {
          animation: glowPulse 3s infinite;
        }
        
        /* Glowing play button */
        .play-button-glow {
          box-shadow: 0 0 15px rgba(79, 70, 229, 0.4);
          transition: box-shadow 0.3s ease;
        }
        
        .play-button-glow:hover {
          box-shadow: 0 0 20px rgba(79, 70, 229, 0.7), 0 0 40px rgba(79, 70, 229, 0.3);
        }
        
        /* Star background animation */
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background-color: white;
          border-radius: 50%;
          animation: twinkle 5s infinite;
        }
        
        @keyframes twinkle {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        /* Magic particles effect */
        .magic-particle {
          position: absolute;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(138,92,246,0.4) 100%);
          border-radius: 50%;
          opacity: 0;
          animation: float-up-and-fade;
        }
        
        @keyframes float-up-and-fade {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-100px) scale(1); opacity: 0; }
        }
        
        /* Card hover effects */
        .enchanted-card, .enchanted-album, .enchanted-playlist, .enchanted-recent {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          will-change: transform, box-shadow;
        }
        
        .enchanted-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);
        }
        
        .enchanted-album:hover, .enchanted-playlist:hover, .enchanted-recent:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3);
        }
        
        /* Empty results animation */
        .enchanted-empty-animation {
          animation: pulse-rotate 4s infinite;
        }
        
        @keyframes pulse-rotate {
          0% { transform: scale(1) rotate(0deg); opacity: 0.7; }
          50% { transform: scale(1.1) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
        }
        
        @keyframes glowPulse {
          0% { opacity: 0.2; }
          50% { opacity: 0.5; }
          100% { opacity: 0.2; }
        }
        
        /* Enchanted overlay effect */
        .enchanted-overlay {
          background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
        }
        
        /* Input focus animation */
        .enchanted-input:focus {
          animation: subtle-pulse 2s infinite;
        }
        
        @keyframes subtle-pulse {
          0% { box-shadow: 0 0 0 rgba(139, 92, 246, 0); }
          50% { box-shadow: 0 0 10px rgba(139, 92, 246, 0.3); }
          100% { box-shadow: 0 0 0 rgba(139, 92, 246, 0); }
        }
      `}</style>
    );
  };
  
  export default EnchantedStyles;