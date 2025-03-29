import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import bgImage from "./807247.jpg";

const Hero = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="relative flex items-center justify-center h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}>
      
      <div className="absolute inset-0 bg-black/60"></div> {/* Dark Overlay */}

      <div className="relative z-10 text-center text-white px-6 max-w-3xl">
        <h1 className="text-5xl font-bold mb-4">Be Prepared. Stay Safe.</h1>
        <p className="text-lg mb-6">
          AI-powered disaster prediction & alerts at your fingertips.
        </p>

        {/* Centered Button */}
        <div className="flex justify-center">
          <button 
            onClick={() => navigate("/disaster")} // Navigate to DisasterMap
            className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 
            border border-white text-white bg-transparent flex items-center gap-2
            hover:bg-white hover:text-black hover:shadow-md 
            active:scale-95">
            Check Disaster Alerts  
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Hero;
