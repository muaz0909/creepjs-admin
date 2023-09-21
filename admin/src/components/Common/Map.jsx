import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import customMarkerIcon from "../../assets/img/icons/common/icon.png";
import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
  iconUrl: customMarkerIcon,
  iconSize: [32, 32], // Adjust the size as needed
  iconAnchor: [16, 32], // Adjust the anchor point as needed
});
function Map(props) {
  useEffect(() => {
    console.log(props.location);
  }, []);
  return (
    <MapContainer
      center={props.location}
      zoom={13}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "400px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={props.location} icon={customIcon}>
        <Popup>Current Location</Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map;
