import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AgmCoreModule } from '@agm/core';

import { RequestDisposalPage } from './request-disposal.page';
import { TakePhotosComponent } from './take-photos/take-photos.component';
import { TextSearchLocationComponent } from './text-search-location/text-search-location.component';
import { MapSearchLocationComponent } from './map-search-location/map-search-location.component';

const routes: Routes = [
  {
    path: '',
    component: RequestDisposalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AgmCoreModule
  ],
  declarations: [
    RequestDisposalPage,
    TakePhotosComponent,
    TextSearchLocationComponent,
    MapSearchLocationComponent,
  ],
  entryComponents: [
    TextSearchLocationComponent,
    MapSearchLocationComponent,
  ]
})
export class RequestDisposalPageModule {}
