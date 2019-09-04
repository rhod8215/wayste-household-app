import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

import { auth } from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { Platform } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { googleOAuthWebClientId } from '@env/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentAuthUser: firebase.User;
  $currentAuthUser: BehaviorSubject<firebase.User|null>;

  constructor(
    private afAuth: AngularFireAuth,
    private afStorage: AngularFireStorage,
    private facebook: Facebook,
    private googlePlus: GooglePlus,
    private platform: Platform,
    private userService: UserService
  ) {
    this.init();
  }

  init() {
    this.$currentAuthUser = new BehaviorSubject(undefined);
    this.afAuth.auth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.currentAuthUser = user;
        this.$currentAuthUser.next(user);
      } else {
        this.$currentAuthUser.next(null);
        this.currentAuthUser = null;
      }

      this.userService.setCurrentUser(user);
    });
  }

  async signInViaEmail(
    email: string,
    password: string,
  ) {
    await this.afAuth.auth
      .signInWithEmailAndPassword(email, password);
  }

  async signUpViaEmail(
    fullName: string,
    email: string,
    password: string,
  ) {
    await this.afAuth.auth
      .createUserWithEmailAndPassword(email, password);

    // assumption -- currentAuthUser should already be loaded by now
    await this.updateName(fullName);
    await this.userService.createUser(
      this.currentAuthUser.uid,
      fullName,
      email,
    );
    await this.userService.setCurrentUser(this.currentAuthUser);
  }

  async authViaGoogle() {
    try {
      if (this.platform.is('cordova')) {
        const googlePlusUser = await this.googlePlus.login({
          webClientId: googleOAuthWebClientId,
          offline: true,
          scopes: 'profile email',
        });

        const googleCredential = auth.GoogleAuthProvider.credential(googlePlusUser.idToken);
        const firebaseUser = await this.afAuth.auth.signInWithCredential(googleCredential)
        return firebaseUser;
      } else {
        const provider = new auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        return await this.afAuth.auth.signInWithRedirect(provider);
      }
    } catch (error) {
      alert(error.toString());
      alert(JSON.stringify(error));
      // Ignore if user just cancelled dialog
      if (error.toString() == 12501) {
        throw {code: 12501};
      }
      throw error;
    }
  }

  async authViaFB() {
    try {
      if (this.platform.is('cordova')) {
        const response: FacebookLoginResponse = await this.facebook.login(['public_profile', 'email']);
        const facebookCredential = auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
        const success = await this.afAuth.auth.signInWithCredential(facebookCredential)
        alert("Firebase success: " + JSON.stringify(success));
      } else {
        const provider = new auth.FacebookAuthProvider();
        await this.afAuth.auth.signInWithRedirect(provider);
      }
    } catch (error) {

      alert(error.toString());
      alert(JSON.stringify(error));
      // Ignore if user just cancelled dialog
      if (error.errorCode == 4201) {
        throw { code: 4201 };
      }
      throw error;
    }
  }

  async updateName(
    fullName: string|null,
  ) {
    if (!this.currentAuthUser) {
      throw new Error('No user logged in');
    }

    const newProfileInfo = {
      displayName: fullName,
    };

    await this.currentAuthUser.updateProfile(newProfileInfo);
  }

  async updatePhotoUrl(
    photoUrl: string|null,
  ) {
    if (!this.currentAuthUser) {
      throw new Error('No user logged in');
    }

    const newProfileInfo = {
      photoURL: photoUrl,
    };

    await this.currentAuthUser.updateProfile(newProfileInfo);
  }

  async resetPassword() {
    if (!this.currentAuthUser) {
      throw new Error('No user logged in');
    }

    await this.afAuth.auth.sendPasswordResetEmail(this.currentAuthUser.email);
  }

  /**
   * Returns photoUrl
   * @param fileDataUrl
   */
  uploadAuthPhoto(fileDataUrl: string): Promise<string> {
    const filePath = `image/dp/household_${this.currentAuthUser.uid}`;
    const fileRef = this.afStorage.ref(filePath);
    const task = fileRef.putString(fileDataUrl, 'data_url');

    return new Promise((resolve, reject) => {
      try {
        task.snapshotChanges().pipe(
          finalize(async () => {
            const photoUrl = await fileRef.getDownloadURL().toPromise();
            await this.updatePhotoUrl(photoUrl);
            resolve(photoUrl);
          })
        ).subscribe();
      } catch (error) {
        reject(error);
      }
    })
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }
}
