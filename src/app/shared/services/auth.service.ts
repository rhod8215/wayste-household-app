import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

import { auth } from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentAuthUser: firebase.User;
  $currentAuthUser: BehaviorSubject<firebase.User|null>;

  constructor(
    private afAuth: AngularFireAuth,
    private afStorage: AngularFireStorage,
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
    const provider = new auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    await this.afAuth.auth.signInWithRedirect(provider);
  }

  async authViaFB() {
    const provider = new auth.FacebookAuthProvider();
    await this.afAuth.auth.signInWithRedirect(provider);
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
