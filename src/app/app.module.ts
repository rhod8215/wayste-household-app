import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import { AgmCoreModule } from '@agm/core';
import { AngularCropperjsModule } from 'angular-cropperjs';

import { firebaseConfig, googleAPIKey } from '@env/config';
import { LocationService } from '@shared/services/location.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularCropperjsModule,
    AgmCoreModule.forRoot({
      apiKey: googleAPIKey,
      libraries: ['places', 'directions']
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    LocationService,
    Camera,
    GooglePlus,
    Facebook,
    CallNumber,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: StorageBucket, useValue: firebaseConfig.storageBucket },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
