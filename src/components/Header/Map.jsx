import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const position = [10.8419, 106.8091]; // Toạ độ Đại học FPT HCM

  return (
    <div className="flex justify-center items-center p-6">
      <div className="w-full max-w-4xl shadow-lg rounded-lg overflow-hidden">
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}>
            <Popup>
              <strong>📍 Đại học FPT Hồ Chí Minh</strong> <br />
              Khu Công Nghệ Cao, Thủ Đức, TP.HCM
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
