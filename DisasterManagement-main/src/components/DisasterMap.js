import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import bgImage from "./fantasy-art-digital-art-pixelated-artwork-wallpaper-preview.jpg";

// Custom icons for disasters
const fireIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Fire-icon.png",
  iconSize: [30, 30],
});
const earthquakeIcon = new L.Icon({
  iconUrl: "data:image/png;base64,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", // Replace with a valid image URL
  iconSize: [30, 30],
});
const floodIcon = new L.Icon({
  iconUrl: "data:image/png;base64,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",
  iconSize: [30, 30],
});
const tsunamiIcon = new L.Icon({
  iconUrl: "data:image/png;base64,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",
  iconSize: [30, 30],
});

const DisasterMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [suggestions, setSuggestions] = useState("No suggestions available.");
  const [disasters, setDisasters] = useState([]);

  // Fetch flood risk locations from FastAPI
  useEffect(() => {
    const fetchFloodData = async () => {
      try {
        const response = await fetch("http://localhost:8000/predict_flood");
        const data = await response.json();
        console.log("Flood Data:", data);

        if (data.flood_risk_locations) {
          const floodDisasters = data.flood_risk_locations.map((location) => ({
            type: "flood",
            lat: location.latitude,
            lon: location.longitude,
            location: `Lat: ${location.latitude}, Lon: ${location.longitude}`,
          }));
          setDisasters(floodDisasters); // Replace the entire disasters array
        }
      } catch (error) {
        console.error("Error fetching flood data:", error);
      }
    };

    fetchFloodData();
  }, []);
useEffect(() => {
  const fetchEarthquakeData = async () => {
    try {
      const response = await fetch("http://localhost:8000/latest-earthquake/");
      const data = await response.json();
      console.log("Earthquake Data:", data); // ✅ Check if this logs correctly

      if (data.latitude && data.longitude) {
        setDisasters((prevDisasters) => [
          ...prevDisasters,
          {
            type: "earthquake",
            lat: data.latitude,  // ✅ Correct field
            lon: data.longitude, // ✅ Correct field
            location: data.place || `Lat: ${data.latitude}, Lon: ${data.longitude}`,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
    }
  };

  fetchEarthquakeData();
}, []);
  // Function to get safety suggestions based on disaster type
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
      <Marker position={userLocation} icon={tsunamiIcon}> 
        <Popup>You are here</Popup>
      </Marker>
    ) : null;
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#0d0d0d] text-white px-10 bg-cover bg-center w-full"
      style={{ backgroundImage: `url(${bgImage})` }}>
      
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
          <MapContainer center={[26.15, 88.65]} zoom={6} style={{ width: "100%", height: "60vh" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />

            {disasters.map((disaster, index) => (
              <Marker
                key={index}
                position={[disaster.lat, disaster.lon]}
                icon={disaster.type === "fire"
        ? fireIcon
        : disaster.type === "flood"
        ? floodIcon
        : disaster.type === "earthquake"
        ? earthquakeIcon
        : tsunamiIcon}
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
    </div>
  );
};

export default DisasterMap;
