import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
<nav className="fixed top-0 w-full backdrop-blur-md shadow-md z-50">
<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex justify-between items-center h-16">
        
        {/* Logo */}
        <Link to="/" className="text-white text-xl font-semibold flex items-center">
        Disaster.AI
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="#" className="nav-link font-semibold">Home</Link>
          <Link to="#" className="nav-link font-semibold">Alerts</Link>
          <Link to="#" className="nav-link font-semibold">Seek Help</Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-16 left-0 w-full bg-black/80 backdrop-blur-md shadow-md p-4 space-y-4 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Link to="#" className="block text-white text-lg" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="#" className="block text-white text-lg" onClick={() => setIsOpen(false)}>Alerts</Link>
        <Link to="#" className="block text-white text-lg" onClick={() => setIsOpen(false)}>Seek Help</Link>
      </div>
    </nav>
  );
};

export default Navbar;
