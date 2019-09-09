import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';

import { IonicModule } from '@ionic/angular';

import { TrackCollectorPage } from './track-collector.page';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path: '',
    component: TrackCollectorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AgmCoreModule,
  ],
  declarations: [
    TrackCollectorPage,
    ChatComponent,
  ],
  entryComponents: [
    ChatComponent,
  ]
})
export class TrackCollectorPageModule {}
