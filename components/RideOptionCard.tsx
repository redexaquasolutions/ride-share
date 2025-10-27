
import React from 'react';
import { RideOption } from '../types';
import { CarIcon, UserIcon } from './Icons';

interface RideOptionCardProps {
  option: RideOption;
  isSelected: boolean;
  onSelect: () => void;
}

const RideOptionCard: React.FC<RideOptionCardProps> = ({ option, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-700 hover:border-gray-600 bg-gray-800'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <CarIcon className={`h-8 w-8 mr-4 ${isSelected ? 'text-cyan-400' : 'text-gray-400'}`} />
          <div>
            <h3 className="font-bold text-lg">{option.type}</h3>
            <p className="text-sm text-gray-400">{option.eta} away</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">{option.price}</p>
          <div className="flex items-center text-gray-400 text-sm">
             <UserIcon className="h-4 w-4 mr-1"/>
             <span>{option.capacity}</span>
          </div>
        </div>
      </div>
      {isSelected && (
         <p className="text-sm text-gray-300 mt-2 pt-2 border-t border-gray-700">{option.description}</p>
      )}
    </div>
  );
};

export default RideOptionCard;
