import { User, Collector } from './user';
import { Coords, Location } from './location';

export interface Disposal {
  id?: string;
  household: User;
  collector?: Collector;
  disposalLoc: Location;
  ecoAideOrigLoc?: Coords;
  collectorCoords?: Coords; // coordinates to track distance
  timeRequested?: string|Date; //required supposedly
  timeAccepted?: string|Date;
  timeCompleted?: string|Date;
  cancelled?: {
    by: string; // household or ecoAide
    reason?: string;
    time: string;
  };
  photoUrlList?: Array<String>; // required supposedly
}
