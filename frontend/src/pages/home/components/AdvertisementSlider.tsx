import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ads = [
  {
    id: 1,
    image: "/image-slider/image-slider-1.jpg",
    title: "Upgrade to Premium!",
    description: "Listen without limits with Spotifyz Premium",
    gradientFrom: "from-purple-800",
    gradientTo: "to-blue-800"
  },
  {
    id: 2,
    image: "/image-slider/image-slider-2.jpg",
    title: "Enhanced Music Experience",
    description: "Download your favorite tracks and enjoy offline",
    gradientFrom: "from-green-800",
    gradientTo: "to-emerald-800"
  },
  {
    id: 3,
    image: "/image-slider/image-slider-3.jpg",
    title: "AI Music Assistant",
    description: "Get personalized recommendations with our AI",
    gradientFrom: "from-rose-800",
    gradientTo: "to-pink-800"
  }
];

export const AdvertisementSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ads.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % ads.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + ads.length) % ads.length);
  };

  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-lg">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${ads[currentSlide].gradientFrom} ${ads[currentSlide].gradientTo} opacity-90`} />
      
      {/* Content */}
      <div className="relative h-full flex items-center">
        {/* Text content */}
        <div className="flex-1 p-8 z-10">
          <h2 className="text-4xl font-bold mb-4">{ads[currentSlide].title}</h2>
          <p className="text-lg text-zinc-200">{ads[currentSlide].description}</p>
          <Button className="mt-6 bg-white hover:bg-white/90 text-black font-bold">
            Upgrade Now
          </Button>
        </div>
        
        {/* Image */}
        <div className="w-1/2 h-full relative">
          <img 
            src={ads[currentSlide].image} 
            alt={ads[currentSlide].title}
            className="absolute right-0 h-full w-full object-cover object-center"
          />
        </div>
      </div>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/40 text-white rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/40 text-white rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {ads.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-4" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};