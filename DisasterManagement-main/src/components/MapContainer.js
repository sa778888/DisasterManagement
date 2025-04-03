import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
  return (
    <MapContainer center={[-33.9, 151.2]} zoom={10} style={{ width: "100vw", height: "100vh" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // ✅ OpenStreetMap (No API Key Needed)
      />
      <Marker position={[-33.890542, 151.274856]}>
        <Popup>Bondi Beach</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
