
export interface RideOption {
  type: string;
  eta: string;
  price: string;
  description: string;
  capacity: string;
}

export enum AppState {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  RESULTS = 'RESULTS',
  CONFIRMED = 'CONFIRMED',
  EN_ROUTE = 'EN_ROUTE',
  ARRIVED = 'ARRIVED',
}
