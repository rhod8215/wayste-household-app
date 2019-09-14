import { User } from './user';
import { Coords, Location } from './location';

export interface Disposal {
  id?: string;
  household: User;
  ecoAide?: User;
  householdLoc: Location;
  ecoAideOrigLoc?: Coords;
  coordsTracked?: Coords; // coordinates to track distance
  timeRequested: string|Date;
  timeAccepted?: string|Date;
  timeCompleted?: string|Date;
  cancelled?: {
    by: string; // household or ecoAide
    reason?: string;
    time: string;
  };
}
