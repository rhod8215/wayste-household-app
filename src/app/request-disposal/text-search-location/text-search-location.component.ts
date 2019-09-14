import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { LocationService } from '@shared/services/location.service';
import { MapsAPILoader } from '@agm/core';
import { PlacePredictionTextSearchService } from '@shared/services/place-prediction-text-search.service';
import { Observable } from 'rxjs/Observable';
import { text_search_loc } from '@shared/models/location';
import { Location } from '@angular/common';
import { MapSearchLocationComponent } from '../map-search-location/map-search-location.component';


@Component({
  selector: 'app-text-search-location',
  templateUrl: './text-search-location.component.html',
  styleUrls: ['./text-search-location.component.scss'],
})
export class TextSearchLocationComponent implements OnInit {

  searchTerm: string = '';
  searchControl: FormControl;
  placeList: Array<any> = [];
  results$: Observable<any[]>;
  testResult = [{description: 'test'},{description: 'test'}];
  searchedLoc:any;

  constructor (
    private modalCtrl: ModalController,
    public locationService: LocationService,
    private placePredictionService: PlacePredictionTextSearchService,
    private mapsAPILoader: MapsAPILoader
  ) { }

  ngOnInit() {
    this.locationService.getCurrentLocation();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async viewMap() {
    this.modalCtrl.dismiss();
    console.log('view map');
    const modal = await this.modalCtrl.create({
      component: MapSearchLocationComponent 
    });

    // modal.onDidDismiss()
    //   .then(data => {
    //     if (data.data) {
    //       this.pickUpLocation = data.data;
    //     }
    //   });
    //   console.log("pick-up", this.pickUpLocation);

    return await modal.present();
  
    
    
    
  }

  useCurrentLocation() {
    console.log('useCurrentLocation');
  }

  async searchPlaces(searchTerm) {
    console.log(searchTerm);
  }

  onSearch(searchLoc: string){

    this.searchTerm = searchLoc;
    if (this.searchTerm === '') return;
    this.results$ = this.placePredictionService.getPlacePredictions(searchLoc);
   }

  async sel_location(sel_add){
    const locationAdd:any = sel_add;
    
    const selectedLocation: text_search_loc={

      address: locationAdd
    }
    this.searchedLoc = Object.assign({}, selectedLocation);
    console.log('text-search', this.searchedLoc);
    this.modalCtrl.dismiss(this.searchedLoc);

    
  }
 
  
}
