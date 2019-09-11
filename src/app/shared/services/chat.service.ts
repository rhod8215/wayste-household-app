import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

const CHATS = '/chats';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private rtdb: AngularFireDatabase) { }

  getMessages(disposalId: string): Observable<any[]> {
    return this.rtdb.list(`${CHATS}/${disposalId}`).valueChanges();
  }

  async addMessage(
    disposalId: string,
    sender: string,
    message: string
  ): Promise<void> {
    const chatRef = this.rtdb.list(`${CHATS}/${disposalId}`);
    await chatRef.push({
      sender,
      message,
    });
  }
}
