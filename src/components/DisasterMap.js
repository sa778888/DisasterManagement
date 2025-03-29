import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import bgImage from "./fantasy-art-digital-art-pixelated-artwork-wallpaper-preview.jpg";

// Custom icons for disasters
const fireIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Fire-icon.png",
  iconSize: [30, 30],
});
const floodIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/Water_icon.svg",
  iconSize: [30, 30],
});
const tsunamiIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/Tsunami_Warning.svg",
  iconSize: [30, 30],
});

const DisasterMap = () => {
  
  const [userLocation, setUserLocation] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [suggestions, setSuggestions] = useState("No suggestions available.");

  const [disasters] = useState([
    { type: "fire", lat: 28.61, lon: 77.20, location: "Delhi" },
    { type: "flood", lat: 19.07, lon: 72.87, location: "Mumbai" },
    { type: "wild fire", lat: 12.97, lon: 77.59, location: "Bangalore" },
    { type: "land slide", lat: 13.08, lon: 80.27, location: "Chennai" } 
  ]);

  // Fetch disaster safety tips
  const getSuggestions = (disasterType) => {
    const tips = {
      "wild fire": [
        "🚒 Stay low to avoid smoke inhalation.",
        "🔥 Cover your nose with a wet cloth.",
        "🚪 If trapped, close doors and signal for help.",
        "📞 Call emergency services immediately.",
        "🔥 If your clothes catch fire, STOP, DROP, and ROLL."
      ],
      "flood": [
        "🚗 Avoid driving through flooded roads.",
        "🌊 Move to higher ground immediately.",
        "📻 Stay tuned to emergency broadcasts.",
        "🔋 Keep your phone and power banks charged.",
        "💧 Store clean drinking water."
      ],
      "land slide": [
        "⛰️ Stay away from steep slopes and unstable terrain.",
        "🚨 If you hear rumbling sounds, evacuate immediately.",
        "🏃 Move to higher ground.",
        "📻 Stay updated with weather reports.",
        "📦 Keep an emergency kit ready with food and medical supplies."
      ],
      "default": ["⚠️ Stay alert and follow emergency protocols."]
    };
    return tips[disasterType] || tips["default"];
  };

  // Check if user is near a disaster
  const checkForAlerts = (lat, lon) => {
    const dangerZone = disasters.find(
      (disaster) => getDistance(lat, lon, disaster.lat, disaster.lon) < 50 
    );

    if (dangerZone) {
      setAlertMessage(`⚠️ ${dangerZone.type.toUpperCase()} Alert! ${dangerZone.location} is affected.`);
      setSuggestions(getSuggestions(dangerZone.type));
    } else {
      setAlertMessage(null);
      setSuggestions("No suggestions available.");
    }
  };

  // Calculate distance between two points
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))); 
  };

  // Handle user clicks on map
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setUserLocation([lat, lng]);
        checkForAlerts(lat, lng);
      },
    });

    return userLocation ? (
      <Marker position={userLocation}>
        <Popup>You are here</Popup>
      </Marker>
    ) : null;
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#0d0d0d] text-white px-10 bg-cover bg-center h-screen w-full"
    style={{ backgroundImage: `url(${bgImage})`  }}>
      {/* Alerts Section */}
      <div className="w-1/4 p-6">
        <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 text-gray-200">Alerts</h2>
        <div
          className={`mt-4 h-[60vh] border rounded-xl p-4 shadow-lg transition-all duration-500 bg-[#161616] backdrop-blur-lg ${
            alertMessage
              ? "border-red-500 text-white animate-pulse shadow-red-500/50"
              : "border-gray-800 text-gray-400"
          }`}
        >
          {alertMessage ? (
            <div>
              <h3 className="text-lg font-bold">🚨 ALERT 🚨</h3>
              <p>{alertMessage}</p>
            </div>
          ) : (
            <p>No alerts at the moment</p>
          )}
        </div>
      </div>

      {/* Map Section */}
      <div className="w-1/2 p-6">
        <div className="border border-gray-800 bg-[#161616] rounded-xl overflow-hidden shadow-xl backdrop-blur-lg">
          <MapContainer center={[20, 77]} zoom={5} style={{ width: "100%", height: "60vh" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />

            {disasters.map((disaster, index) => (
              <Marker
                key={index}
                position={[disaster.lat, disaster.lon]}
                icon={disaster.type === "fire" ? fireIcon : disaster.type === "flood" ? floodIcon : tsunamiIcon}
              >
                <Popup>
                  <strong>{disaster.type.toUpperCase()}</strong> <br />
                  Location: {disaster.location}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="w-1/4 p-6">
        <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 text-gray-200">Safety Tips</h2>
        <div className="mt-4 min-h-[60vh] max-h-[90vh] overflow-y-auto bg-[#161616] border border-gray-800 rounded-xl p-4 shadow-lg backdrop-blur-lg">
          {Array.isArray(suggestions) ? (
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {suggestions.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">{suggestions}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisasterMap;
