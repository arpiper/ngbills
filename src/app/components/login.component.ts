import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

import { LoginService } from '../services/login.service';

@Component({
  moduleId: module.id,
  selector: 'login-cmp',
  template: `
    <div>
      <form class="form login" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <label class="form__username">
          Username: 
          <input type="text" name="username" formControlName="username">
        </label>
        <label class="form__password">
          Password:
          <input type="password" name="password" formControlName="password">
        </label>
        <button class="form__submit button button_size_small" type="submit">Login</button>
      </form>
    </div>
  `,
  styles: [`
    .form {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
    }
    
  `],
})

export class LoginComponent implements OnInit {
  private loginForm: FormGroup;
  @Output() loginSuccessful: EventEmitter<any> = new EventEmitter();
  
  constructor(
    private loginService: LoginService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }

  onSubmit() {
    this.loginService.login(this.loginForm.value.username, this.loginForm.value.password);
  }
}
