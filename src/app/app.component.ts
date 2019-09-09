import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MapsAPILoader } from '@agm/core';

import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Account',
      url: '/account',
      icon: 'person'
    }
  ];

  isLoggedIn: boolean;

  constructor(
    private auth: AuthService,
    private platform: Platform,
    private mapsApiLoader: MapsAPILoader,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();

    this.auth.$currentAuthUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.mapsApiLoader.load();
    });
  }

  signOut() {
    this.auth.signOut();
  }
}
