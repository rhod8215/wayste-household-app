import { Injectable } from '@angular/core';
import { Coords } from '@shared/models/location';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class DirectionService {

  dirService = new google.maps.DirectionsService;

  constructor() { }

  async getRoutes(
    origin: Coords,
    destination: Coords,
    waypointList: Array<Coords>,
  ) {

    return new Promise((resolve, reject) => {
      const routeCallback = (response, status) => {
        if (status === 'OK') {
          resolve(response);
        } else {
          reject('Unable to retrieve routes.');
        }
      };

      this.dirService.route({
        origin: this.getAsLatLng(origin),
        destination: this.getAsLatLng(destination),
        waypoints: waypointList.map((waypoint: Coords) => ({
          location: this.getAsLatLng(waypoint)
        })),
        optimizeWaypoints: true,
        travelMode: 'DRIVING',
      }, routeCallback);
    })
  }

  getRenderer(suppressMarkers = true) {
    return new google.maps.DirectionsRenderer({ suppressMarkers });
  }

  private getAsLatLng(coords: Coords) {
    return new google.maps.LatLng(coords.lat, coords.lng)
  }
}
