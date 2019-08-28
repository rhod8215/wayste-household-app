import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { LocationService } from '@shared/services/location.service';

@Component({
  selector: 'app-text-search-location',
  templateUrl: './text-search-location.component.html',
  styleUrls: ['./text-search-location.component.scss'],
})
export class TextSearchLocationComponent implements OnInit {
  searchTerm: string = '';
  searchControl: FormControl;
  placeList: Array<any> = [];

  constructor (
    private modalCtrl: ModalController,
    public locationService: LocationService
  ) { }

  ngOnInit() {
    this.locationService.getCurrentLocation();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  viewMap() {
    console.log('view map');
  }

  useCurrentLocation() {
    console.log('useCurrentLocation');
  }

  async searchPlaces(searchTerm) {
    console.log(searchTerm);
  }
}
