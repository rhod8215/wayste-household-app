import { Injectable } from '@angular/core';
import { firestore } from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';

import { User } from '@shared/models/user';
import { BehaviorSubject } from 'rxjs';

const COLLECTION_TITLE = 'household_users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userRef: firestore.CollectionReference;

  currentUser: User;
  currentUser$: BehaviorSubject<User|null>;

  constructor(private afs: AngularFirestore) {
    this.currentUser$ = new BehaviorSubject(null);
    this.userRef = this.afs.collection(COLLECTION_TITLE).ref;
  }

  async getUserById(userId: string): Promise<User> {
    const docSnapshot = await this.userRef.doc(userId).get();
    if (!docSnapshot.exists) {
      return null;
    }

    return {
      name: docSnapshot.get('name'),
      email: docSnapshot.get('email'),
      contactNumber: docSnapshot.get('contactNumber'),
      address: docSnapshot.get('address'),
    };
  }

  async setCurrentUser(currentAuthUser: firebase.User): Promise<void> {
    if (!currentAuthUser) {
      this.currentUser = null;
    } else {
      const user = await this.getUserById(currentAuthUser.uid);
      this.currentUser = {
        id: currentAuthUser.uid,
        photoUrl: currentAuthUser.photoURL,
        ...user
      };
    }
    this.currentUser$.next(this.currentUser);
  }

  async createUser(
    userId: string,
    name: string,
    email: string,
    address?: string,
  ) {
    const userExists = await this.getUserById(userId);
    if (!!userExists) {
      throw new Error(`UserID: "${userId}" already exists!`);
    }

    let userInfo: User = {
      name,
      email,
    };

    if (address) {
      userInfo = {
        ...userInfo,
        address
      };
    }

    return await this.userRef.doc(userId).set(userInfo);
  }

  async updateUser(
    userId: string,
    name: string,
    contactNumber: string,
    address: string
  ) {
    const userExists = await this.getUserById(userId);
    if (!userExists) {
      await this.createUser(
        userId,
        name,
        contactNumber,
        address
      );
    } else {
      await this.userRef.doc(userId).update({
        name,
        contactNumber,
        address
      });
    }
  }
}
