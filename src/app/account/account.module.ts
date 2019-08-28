import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AngularCropperjsModule } from 'angular-cropperjs';

import { AccountPage } from './account.page';
import { UpdateProfileInfoComponent } from './update-profile-info/update-profile-info.component';
import { PhotoCropperComponent } from './photo-cropper/photo-cropper.component';

const routes: Routes = [
  {
    path: '',
    component: AccountPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AngularCropperjsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    UpdateProfileInfoComponent,
    PhotoCropperComponent,
  ],
  declarations: [
    AccountPage,
    UpdateProfileInfoComponent,
    PhotoCropperComponent,
  ],
})
export class AccountPageModule {}
