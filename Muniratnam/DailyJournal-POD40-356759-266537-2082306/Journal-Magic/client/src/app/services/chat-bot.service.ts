import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.models';
import { AuthService } from './auth.service';

export interface ChatMessage {
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  private chatHistory: ChatMessage[] = [];
  private chatSubject = new BehaviorSubject<ChatMessage[]>([]);
  public chat$ = this.chatSubject.asObservable();

  constructor(private authService: AuthService) {
    // Listen for login events
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.sendWelcomeMessage(user);
      }
    });
  }

  private sendWelcomeMessage(user: User): void {
    const hour = new Date().getHours();
    let greeting = 'Hello';
    
    if (hour < 12) {
      greeting = 'Good morning';
    } else if (hour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }
    
    const welcomeMessage: ChatMessage = {
      sender: 'bot',
      content: `${greeting}, ${user.firstName}! Welcome to Journal Magic. How are you feeling today?`,
      timestamp: new Date()
    };
    
    this.addMessage(welcomeMessage);
    
    // Check if it's been more than a day since last entry
    const lastLogin = new Date(user.lastLogin);
    const today = new Date();
    const daysSinceLastLogin = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastLogin > 1) {
      setTimeout(() => {
        this.addMessage({
          sender: 'bot',
          content: `I notice it's been ${daysSinceLastLogin} days since your last journal entry. Would you like to create a new entry now?`,
          timestamp: new Date()
        });
      }, 2000);
    }
  }

  public sendUserMessage(content: string): void {
    const message: ChatMessage = {
      sender: 'user',
      content,
      timestamp: new Date()
    };
    
    this.addMessage(message);
    this.processUserMessage(content);
  }

  private processUserMessage(content: string): void {
    // Simple keyword detection for basic responses
    const lowerContent = content.toLowerCase();
    let response: string;
    
    if (/good|great|happy|excellent|fantastic/i.test(lowerContent)) {
      response = "I'm glad to hear you're feeling positive! Would you like to record this in your journal?";
    } else if (/bad|sad|depressed|unhappy|terrible/i.test(lowerContent)) {
      response = "I'm sorry to hear that. Writing about your feelings might help. Would you like to start a journal entry?";
    } else if (/journal|write|entry|record/i.test(lowerContent)) {
      response = "I can help you create a new journal entry. Click on the 'New Entry' button to get started.";
    } else if (/mood|feeling|emotion/i.test(lowerContent)) {
      response = "Tracking your mood is important. You can use our emoji selector or slider to record how you're feeling today.";
    } else if (/help|how to|tutorial/i.test(lowerContent)) {
      response = "I'm here to help! You can ask me about creating entries, tracking moods, or viewing your mood trends.";
    } else {
      response = "How can I assist you with your journaling today?";
    }
    
    setTimeout(() => {
      this.addMessage({
        sender: 'bot',
        content: response,
        timestamp: new Date()
      });
    }, 1000);
  }

  private addMessage(message: ChatMessage): void {
    this.chatHistory.push(message);
    this.chatSubject.next([...this.chatHistory]);
  }

  public clearChat(): void {
    this.chatHistory = [];
    this.chatSubject.next([]);
  }
}
