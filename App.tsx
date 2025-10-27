
import React, { useState, useCallback, useEffect } from 'react';
import { RideOption, AppState } from './types';
import { findRides } from './services/geminiService';
import BookingPanel from './components/BookingPanel';
import MapPanel from './components/MapPanel';
import { CarIcon, LogoIcon } from './components/Icons';

const App: React.FC = () => {
  const [pickup, setPickup] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [rideOptions, setRideOptions] = useState<RideOption[]>([]);
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleFindRide = useCallback(async () => {
    if (!pickup || !destination) {
      setError('Please enter both pickup and destination.');
      return;
    }
    setAppState(AppState.SEARCHING);
    setError(null);
    setRideOptions([]);
    setSelectedRide(null);

    try {
      const options = await findRides(pickup, destination);
      setRideOptions(options);
      setAppState(AppState.RESULTS);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setAppState(AppState.IDLE);
    }
  }, [pickup, destination]);

  const handleSelectRide = (ride: RideOption) => {
    setSelectedRide(ride);
  };

  const handleConfirmRide = () => {
    if (selectedRide) {
      setAppState(AppState.CONFIRMED);
      setTimeout(() => setAppState(AppState.EN_ROUTE), 2000);
      setTimeout(() => setAppState(AppState.ARRIVED), 12000); // 10s ride
    }
  };

  const handleReset = () => {
    setPickup('');
    setDestination('');
    setRideOptions([]);
    setSelectedRide(null);
    setAppState(AppState.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-6xl mx-auto h-[700px] bg-gray-800 rounded-2xl shadow-2xl flex overflow-hidden">
        <div className="w-1/3 bg-gray-900 p-8 flex flex-col">
          <header className="flex items-center mb-8">
            <LogoIcon className="h-10 w-10 text-cyan-400" />
            <h1 className="text-3xl font-bold ml-3">
              Gemini <span className="font-light text-cyan-400">Rides</span>
            </h1>
          </header>
          <div className="flex-grow overflow-y-auto pr-2">
            <BookingPanel
              pickup={pickup}
              setPickup={setPickup}
              destination={destination}
              setDestination={setDestination}
              onFindRide={handleFindRide}
              onConfirmRide={handleConfirmRide}
              onSelectRide={handleSelectRide}
              onReset={handleReset}
              rideOptions={rideOptions}
              selectedRide={selectedRide}
              appState={appState}
              error={error}
            />
          </div>
          <footer className="text-center text-gray-500 text-xs mt-4">
            A conceptual app powered by Gemini API.
          </footer>
        </div>
        <div className="w-2/3 bg-gray-800 relative">
          <MapPanel appState={appState} selectedRide={selectedRide} />
        </div>
      </div>
    </div>
  );
};

export default App;
