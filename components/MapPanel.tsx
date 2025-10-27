
import React from 'react';
import { AppState, RideOption } from '../types';
import { CarIcon, LocationPinIcon } from './Icons';

interface MapPanelProps {
  appState: AppState;
  selectedRide: RideOption | null;
}

const MapPanel: React.FC<MapPanelProps> = ({ appState }) => {
  const showCar = appState === AppState.EN_ROUTE || appState === AppState.ARRIVED;
  const carArrived = appState === AppState.ARRIVED;

  return (
    <div className="w-full h-full bg-gray-800 relative overflow-hidden">
      {/* Static map background */}
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1200/900')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent"></div>
      
      {/* Route and Pins */}
      {showCar && (
        <>
            {/* Dotted Line for Route */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path d="M 25% 80% C 40% 20%, 60% 20%, 75% 80%" stroke="#06b6d4" strokeWidth="4" fill="none" strokeDasharray="10 10" />
            </svg>
            <LocationPinIcon className="absolute h-10 w-10 text-green-400 drop-shadow-lg" style={{ left: 'calc(25% - 20px)', top: 'calc(80% - 40px)' }} />
            <LocationPinIcon className="absolute h-10 w-10 text-red-400 drop-shadow-lg" style={{ left: 'calc(75% - 20px)', top: 'calc(80% - 40px)' }} />
        </>
      )}

      {/* Animated Car */}
      {showCar && (
        <div 
          className="absolute transition-all duration-[10000ms] ease-in-out"
          style={{ 
            offsetPath: 'path("M 25% 80% C 40% 20%, 60% 20%, 75% 80%")', 
            offsetDistance: carArrived ? '100%' : '0%',
            motionRotation: 'auto'
          }}
        >
          <CarIcon className="h-10 w-10 text-cyan-300 transform -rotate-90" />
        </div>
      )}

      {!showCar && (
         <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-600 text-2xl font-medium">Your route will appear here</p>
         </div>
      )}
    </div>
  );
};

export default MapPanel;
