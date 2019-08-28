import { Injectable } from '@angular/core';
import { firestore } from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { Location } from '@shared/models/location';
import { User } from '@shared/models/user';

const COLLECTION_TITLE = 'disposals';

@Injectable({
  providedIn: 'root'
})
export class DisposalService {
  disposalRef: firestore.CollectionReference;

  constructor(
    private afs: AngularFirestore,
  ) {
    this.disposalRef = this.afs.collection(COLLECTION_TITLE).ref;
  }

  requestDisposal(
    household: User,
    householdLoc: Location,
  ): Promise<any> {
    return this.disposalRef.add({
      household,
      householdLoc,
      timeRequested: new Date(),
    });
  }
}
