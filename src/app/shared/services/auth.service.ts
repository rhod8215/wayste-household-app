import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentAuthUser: firebase.User;
  $currentAuthUser: BehaviorSubject<firebase.User|null>;

  constructor(private afAuth: AngularFireAuth) {
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
    // contactNumber: string, // TO DO / Postponed: contactNumber for firebase is for auth purposes too
    password: string,
  ) {
    await this.afAuth.auth
      .createUserWithEmailAndPassword(email, password);
    await this.updateProfile(fullName);
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

  async updateProfile(
    fullName: string,
  ) {
    if (!this.currentAuthUser) {
      throw new Error('No user logged in');
    }
    await this.currentAuthUser.updateProfile({displayName: fullName});
  }

  async resetPassword() {
    if (!this.currentAuthUser) {
      throw new Error('No user logged in');
    }
    await this.afAuth.auth.sendPasswordResetEmail(this.currentAuthUser.email);
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }
}
