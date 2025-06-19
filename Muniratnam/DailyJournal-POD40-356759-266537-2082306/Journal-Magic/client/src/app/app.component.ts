import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Journal Magic';
  isAuthenticated = false;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit() {
    // Check the authentication status whenever a route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isAuthenticated = this.authService.isAuthenticated();
    });
    
    // Also check the authentication status when the app initializes
    this.isAuthenticated = this.authService.isAuthenticated();
  }
}
