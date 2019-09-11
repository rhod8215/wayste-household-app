import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ChatService } from '@shared/services/chat.service';
import { ChatMessage } from '@shared/models/chat';
import { Collector } from '@shared/models/user';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  msg: string;
  sending: boolean = false;
  @Input() disposalId: string;
  @Input() collector: Collector;

  chatMessages: ChatMessage[];

  chatSub: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private chatService: ChatService,
  ) { }

  ngOnInit() {
    this.chatSub = this.chatService.getMessages(this.disposalId)
      .subscribe((messages: ChatMessage[]) =>
        this.chatMessages = [...messages]
      );
  }

  ngOnDestroy() {
    this.chatSub.unsubscribe();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async sendMessage() {
    this.sending = true;
    await this.chatService.addMessage(
      this.disposalId,
      'household',
      this.msg,
    );
    this.msg = '';
    this.sending = false;
  }
}
