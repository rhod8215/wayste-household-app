import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Collector } from '@shared/models/user';

interface ChatMessage {
  sender: string;
  message: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  msg: string;
  @Input() collector: Collector;
  // @Input() chatMessages: ChatMessage[];
  chatMessages: ChatMessage[];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.chatMessages = DUMMY_CHAT_MESSAGES;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  sendMessage() {
    console.log(this.msg);
  }
}

const DUMMY_CHAT_MESSAGES = [
  {
    sender: 'collector',
    message: 'Lorem ipsum dolor sit amet, '
  },
  {
    sender: 'household',
    message: 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    sender: 'collector',
    message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    sender: 'household',
    message: 'Duis aute irure dolor in reprehenderit'
  },
  {
    sender: 'collector',
    message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    sender: 'household',
    message: 'Duis aute irure dolor in reprehenderit'
  },
];
