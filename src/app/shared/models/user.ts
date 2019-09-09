import { Coords } from './location';

export interface User {
  id?: string;
  name: string;
  photoUrl?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
}

export interface Collector extends User {
  // Remove ? when finalized
  mrf?: {
    contactNumber?: string,
    coords: Coords,
    formattedAddress: string,
    name: string
  };
  collectorId?: string;
  isTruck?: boolean;
  plateNumber?: string;
  model?: string;
}