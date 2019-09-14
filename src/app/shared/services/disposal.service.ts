import { Injectable } from '@angular/core';
import { firestore } from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { Location } from '@shared/models/location';
import { User } from '@shared/models/user';
import { DateService } from './date.service';
import { AngularFireStorage } from '@angular/fire/storage';

const COLLECTION_TITLE = 'disposals';

@Injectable({
  providedIn: 'root'
})
export class DisposalService {
  disposalRef: firestore.CollectionReference;

  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    private dateService: DateService,
  ) {
    this.disposalRef = this.afs.collection(COLLECTION_TITLE).ref;
  }

  async createDisposal(
    household: User,
    householdLoc: Location,
  ): Promise<string> {
    const disposalRef = await this.disposalRef.add({
      household,
      householdLoc,
      timeRequested: this.dateService.dateNow(),
    });

    return disposalRef.id;
  }

  async updateDisposalWithPhotoUrls(
    disposalId: string,
    photoUrlList: Array<string>
  ): Promise<void> {
    return await this.disposalRef.doc(disposalId).update({photoUrlList});
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
}
