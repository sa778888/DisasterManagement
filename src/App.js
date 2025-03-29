import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero"; 
import DisasterMap from "./components/DisasterMap"; 

const App = () => {
  return (
    <Router> {/* ✅ Only one Router at the top level */}
    <Navbar/>
      <Routes>
        <Route path="/" element={<Hero />} /> 
        <Route path="/disaster" element={<DisasterMap />} /> 
      </Routes>
    </Router>
  );
};

export default App;
