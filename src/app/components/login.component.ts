import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  moduleId: module.id,
  selector: 'login-cmp',
  template: `
    <div>
      <form class="form login" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form__group form__inputs">
          <label class="form__username" for="username">Username</label>
          <input type="text" name="username" formControlName="username" id="username">
        </div>
        <div class="form__group form__inputs">
          <label class="form__password" for="userpass">Password:</label>
          <input type="password" name="password" formControlName="password" id="userpass">
        </div>
        <div class="form__group form__inputs_button">
          <button class="form__submit button button_size_small" type="submit">Login</button>
        </div>
      </form>
    </div>
  `,
})

export class LoginComponent implements OnInit {
  private loginForm: FormGroup;
  private errorMsg: boolean = false;
  @Output() loginSuccessful: EventEmitter<any> = new EventEmitter();
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }

  onSubmit() {
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password)
      .then(response => {
        if (response.status === 200) {
          console.log('login cmp', response);
          sessionStorage.setItem('user', JSON.stringify(response.data));
          this.router.navigate([this.authService.redirect]);
        }
      });
  }
}
