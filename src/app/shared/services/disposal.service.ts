import { Injectable } from '@angular/core';
import { firestore } from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { Location, Coords } from '@shared/models/location';
import { User } from '@shared/models/user';
import { DateService } from './date.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Disposal } from '@shared/models/disposal';
import { Observable } from 'rxjs';

const COLLECTION_TITLE = 'disposals';
const REQUESTED_DISPOSAL_LIST = '/requestedDisposalList';
const ACCEPTED_HOUSEHOLD_LIST = '/acceptedHouseholdList';
const PENDING_ACCEPTANCE_HOUSEHOLD_LIST = '/pendingAcceptanceHouseholdList';
const ACCEPTED_DETAILS_LIST = '/acceptedDetailsList';

@Injectable({
  providedIn: 'root'
})
export class DisposalService {
  disposalRef: firestore.CollectionReference;

  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    private dateService: DateService,
    private rtdb: AngularFireDatabase,
  ) {
    this.disposalRef = this.afs.collection(COLLECTION_TITLE).ref;
  }

  async createDisposal(
    household: User,
    disposalLoc: Location,
  ): Promise<string> {
    const disRef = this.rtdb.list(REQUESTED_DISPOSAL_LIST); //firebase.database().ref().child('posts').push().key;
    const key = disRef.push({
      household,
      disposalLoc,
      timeRequested: this.dateService.dateNow().toString(),
    }).key;

    return key;
  }

  async addHouseholdToPending(
    householdId: string,
    disposalId: string,
    disposalCoords: Coords
  ): Promise<void> {
    const listRef = this.rtdb.object(`${PENDING_ACCEPTANCE_HOUSEHOLD_LIST}/${householdId}`);
    listRef.set({
      disposalId,
      disposalCoords,
    });
  }

  async updateDisposalWithPhotoUrls(
    disposalId: string,
    photoUrlList: Array<string>
  ): Promise<void> {
    return await this.rtdb.list(REQUESTED_DISPOSAL_LIST)
      .update(disposalId, {photoUrlList});
  }

  async saveDisposalImages(
    disposalId: string,
    trashPhotoList: Array<string>,
  ): Promise<Array<string>> {
    const dateNow = this.dateService.getFormattedDateNow();
    let fileRefList = [];

    const trashPhotoPromises = trashPhotoList.map((trashPhoto: string, index: number) => {
      let filePath = `image/disposals/${dateNow}/${disposalId}_${index}`;
      let fileRef = this.afStorage.ref(filePath);
      let task = fileRef.putString(trashPhoto, 'data_url');
      fileRefList.push(fileRef);
      return task.snapshotChanges().toPromise();
    });

    await Promise.all(trashPhotoPromises);
    const photoUrlList = Promise.all(
      fileRefList.map(fileRef => fileRef.getDownloadURL().toPromise())
    );

    return photoUrlList;
  }

  async getPendingAcceptanceDetails(householdId: string): Promise<any> {
    const snapshot = await this.rtdb.object(`${PENDING_ACCEPTANCE_HOUSEHOLD_LIST}/${householdId}`)
    .query
    .once('value');

    const snapValue = snapshot.val();
    if (!snapValue) {
      return false;
    }

    return snapshot.val();
  }

  async getAcceptanceDetails(householdId: string): Promise<any> {
    const snapshot = await this.rtdb.object(`${ACCEPTED_DETAILS_LIST}/${householdId}`)
    .query
    .once('value');

    const snapValue = snapshot.val();
    if (!snapValue) {
      return false;
    }

    return snapshot.val();
  }

  getPendingDisposal(householdId: string): Observable<any> {
    return this.rtdb.object(`${ACCEPTED_HOUSEHOLD_LIST}/${householdId}`).valueChanges();
  }

  getDisposalFromSnap(snapValue: any): Disposal|null {
    return {
      id: snapValue.id,
      collector: {
        address: snapValue.collector.address,
        contactNumber: snapValue.collector.contactNumber,
        email: snapValue.collector.email,
        id: snapValue.collector.id,
        mrf: snapValue.collector.mrf,
        name: snapValue.collector.name,
        photoUrl: snapValue.collector.photoUrl,
      },
      collectorCoords: {
        lat: snapValue.collectorCoords.lat,
        lng: snapValue.collectorCoords.lng,
      },
      household: {
        id: snapValue.household.id,
        address: snapValue.household.address,
        contactNumber: snapValue.household.contactNumber,
        email: snapValue.household.email,
        name: snapValue.household.name,
        photoUrl: snapValue.household.photoUrl,
      },
      disposalLoc: {
        address: snapValue.disposalLoc.address,
        coords: {
          lat: snapValue.disposalLoc.coords.lat,
          lng: snapValue.disposalLoc.coords.lng,
        },
        name: snapValue.disposalLoc.name,
        placeId: snapValue.disposalLoc.placeId,
      },
      photoUrlList: snapValue.photoUrlList,
      timeAccepted: this.dateService.stringToDate(snapValue.timeAccepted),
      timeRequested: this.dateService.stringToDate(snapValue.timeRequested),
    };
  }
}
