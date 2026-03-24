"use client";

import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import lotPolygons from '@/services/lotPolygons.json';
import { Lot } from '@/types';

interface LeafletMapProps {
  lots: Lot[];
  onSelectLot?: (lot: Lot) => void;
}

interface PolygonData {
  id: number;
  center: { lat: number; lng: number };
  paths: { lat: number; lng: number }[];
}

const LeafletMap = ({ lots, onSelectLot }: LeafletMapProps) => {
  // Center of Lomas del Mar based on generate_map.ts
  const center: [number, number] = [-33.4616, -71.6158]; // Updated to match actual data in lotPolygons.json

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#36595F'; // Primary color
      case 'sold': return '#EF4444';      // Red-500
      case 'reserved': return '#F59E0B';  // Amber-500
      default: return '#6B7280';          // Gray-500
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'sold': return 'Vendido';
      case 'reserved': return 'Reservado';
      default: return status;
    }
  };

  const mergedPolygons = useMemo(() => {
    const polys = (lotPolygons as unknown) as PolygonData[];
    return polys.map(poly => {
      const dbLot = lots.find((l: Lot) => l.id === poly.id);
      return {
        ...poly,
        number: dbLot?.number || poly.id.toString(),
        status: dbLot?.status || 'available',
        totalPrice: dbLot?.totalPrice,
        area: dbLot?.area,
        id: poly.id
      };
    });
  }, [lots]);

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border shadow-inner bg-gray-100">
      <MapContainer 
        center={center} 
        zoom={16} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mergedPolygons.map((poly) => (
          <Polygon
            key={`${poly.id}-${poly.number}`}
            positions={poly.paths.map(p => [p.lat, p.lng]) as [number, number][]}
            pathOptions={{
              fillColor: getStatusColor(poly.status),
              fillOpacity: 0.6,
              color: 'white',
              weight: 1
            }}
            eventHandlers={{
              click: () => {
                const fullLot = lots.find((l: Lot) => l.number === poly.number);
                if (fullLot && onSelectLot) {
                  onSelectLot(fullLot);
                }
              }
            }}
          >
            <Tooltip permanent direction="center" className="lot-number-tooltip">
              <span className="text-[10px] font-bold text-white drop-shadow-md">
                {poly.number}
              </span>
            </Tooltip>
            <Popup>
              <div className="p-2 min-w-[150px]">
                <h3 className="font-bold text-lg border-b pb-1 mb-2">Lote {poly.number}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">Estado:</span> {getStatusLabel(poly.status)}</p>
                  {poly.area && <p><span className="font-semibold">Área:</span> {poly.area} m²</p>}
                  {poly.totalPrice && (
                    <p><span className="font-semibold">Precio:</span> ${poly.totalPrice.toLocaleString('es-CL')}</p>
                  )}
                </div>
                {poly.status === 'available' && (
                  <button 
                    className="mt-3 w-full bg-[#36595F] text-white py-1 px-3 rounded text-sm hover:bg-[#2A454A] transition-colors"
                    onClick={() => {
                        const fullLot = lots.find((l: Lot) => l.number === poly.number);
                        if (fullLot && onSelectLot) onSelectLot(fullLot);
                    }}
                  >
                    Ver Detalles
                  </button>
                )}
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
