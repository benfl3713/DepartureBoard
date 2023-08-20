import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(public auth: AuthService, private router: Router) {}

  async login() {
    await this.auth.googleSignin();
    this.auth.user$?.subscribe(user => {
      if (user) {
        this.router.navigate(['/']);
      }
    });
  }
}
