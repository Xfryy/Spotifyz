// D:\Spotifyz\frontend\src\pages\search\components\BackgroundStars.tsx
const BackgroundStars = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="star" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default BackgroundStars;