import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { JournalEntryComponent } from './pages/journal-entry/journal-entry.component';
import { JournalListComponent } from './pages/journal-list/journal-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChatBotComponent } from './components/chat-bot/chat-bot.component';
import { HeaderComponent } from './components/header/header.component';
import { MoodVisualizationComponent } from './components/mood-visualization/mood-visualization.component';

// Services
import { AuthService } from './services/auth.service';
import { JournalService } from './services/journal.service';
import { ChatBotService } from './services/chat-bot.service';

// Interceptors
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    JournalEntryComponent,
    JournalListComponent,
    DashboardComponent,
    ChatBotComponent,
    HeaderComponent,
    MoodVisualizationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthService,
    JournalService,
    ChatBotService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
