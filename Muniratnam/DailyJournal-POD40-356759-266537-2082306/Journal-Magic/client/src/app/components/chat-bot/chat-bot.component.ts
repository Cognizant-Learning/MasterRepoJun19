import { Component, OnInit } from '@angular/core';
import { ChatBotService, ChatMessage } from '../../services/chat-bot.service';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements OnInit {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isMinimized: boolean = false;

  constructor(private chatBotService: ChatBotService) { }

  ngOnInit(): void {
    this.chatBotService.chat$.subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.chatBotService.sendUserMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  toggleMinimize(): void {
    this.isMinimized = !this.isMinimized;
  }

  clearChat(): void {
    this.chatBotService.clearChat();
  }
}
