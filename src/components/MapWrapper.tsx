"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import { Lot } from '@/types';

// Dynamic import to avoid SSR issues
const MapWithNoSSR = dynamic(
  () => import('./LeafletMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-xl border border-dashed animate-pulse">
        <p className="text-gray-500 font-medium tracking-wide">Cargando mapa interactivo...</p>
      </div>
    )
  }
);

interface MapWrapperProps {
  lots: Lot[];
  onSelectLot?: (lot: Lot) => void;
}

export default function MapWrapper({ lots, onSelectLot }: MapWrapperProps) {
  return <MapWithNoSSR lots={lots} onSelectLot={onSelectLot} />;
}
