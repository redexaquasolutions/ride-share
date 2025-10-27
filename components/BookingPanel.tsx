
import React from 'react';
import { RideOption, AppState } from '../types';
import RideOptionCard from './RideOptionCard';
import { LocationPinIcon, LoadingSpinnerIcon, CheckCircleIcon } from './Icons';

interface BookingPanelProps {
  pickup: string;
  setPickup: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  onFindRide: () => void;
  onConfirmRide: () => void;
  onSelectRide: (ride: RideOption) => void;
  onReset: () => void;
  rideOptions: RideOption[];
  selectedRide: RideOption | null;
  appState: AppState;
  error: string | null;
}

const BookingPanel: React.FC<BookingPanelProps> = ({
  pickup,
  setPickup,
  destination,
  setDestination,
  onFindRide,
  onConfirmRide,
  onSelectRide,
  onReset,
  rideOptions,
  selectedRide,
  appState,
  error,
}) => {
  const isInputDisabled = appState !== AppState.IDLE;

  const renderContent = () => {
    switch (appState) {
      case AppState.IDLE:
      case AppState.RESULTS:
        return (
          <>
            <div className="relative mb-4">
              <LocationPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Pickup Location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                disabled={isInputDisabled}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
              />
            </div>
            <div className="relative mb-6">
              <LocationPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={isInputDisabled}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
              />
            </div>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            {appState === AppState.IDLE && (
                 <button
                    onClick={onFindRide}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
                >
                    Find Ride
                </button>
            )}

            {appState === AppState.RESULTS && (
                <>
                <h2 className="text-xl font-semibold mb-4 text-cyan-300">Choose a ride</h2>
                <div className="space-y-3 mb-4">
                    {rideOptions.map((option, index) => (
                    <RideOptionCard
                        key={index}
                        option={option}
                        isSelected={selectedRide?.type === option.type}
                        onSelect={() => onSelectRide(option)}
                    />
                    ))}
                </div>
                <button
                    onClick={onConfirmRide}
                    disabled={!selectedRide}
                    className="w-full bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Confirm {selectedRide?.type || 'Ride'}
                </button>
                </>
            )}
          </>
        );
        case AppState.SEARCHING:
            return (
              <div className="flex flex-col items-center justify-center text-center h-full">
                <LoadingSpinnerIcon className="h-12 w-12 text-cyan-400" />
                <p className="mt-4 text-lg text-gray-300">Finding best routes...</p>
              </div>
            );
        case AppState.CONFIRMED:
        case AppState.EN_ROUTE:
        case AppState.ARRIVED:
            const statusMap = {
                [AppState.CONFIRMED]: { icon: <CheckCircleIcon className="h-12 w-12 text-green-400" />, text: `Your ${selectedRide?.type} is confirmed!` },
                [AppState.EN_ROUTE]: { icon: <LoadingSpinnerIcon className="h-12 w-12 text-cyan-400" />, text: "On your way to destination..." },
                [AppState.ARRIVED]: { icon: <CheckCircleIcon className="h-12 w-12 text-green-400" />, text: "You have arrived!" },
            };
            const { icon, text } = statusMap[appState];

            return (
                <div className="flex flex-col items-center justify-center text-center h-full">
                    {icon}
                    <p className="mt-4 text-lg text-gray-300">{text}</p>
                    {appState === AppState.ARRIVED && (
                        <button
                            onClick={onReset}
                            className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
                        >
                            Book Another Ride
                        </button>
                    )}
                </div>
            );
    }
  };

  return <div className="flex flex-col h-full">{renderContent()}</div>;
};

export default BookingPanel;
