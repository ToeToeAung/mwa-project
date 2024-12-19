import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from './users.service';
import { Router } from '@angular/router';
import { Token, User } from './user.type';
import { StateService } from '../state.service';
import { jwtDecode } from 'jwt-decode';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule,MatListModule,CommonModule,RouterModule],
  template: `
  <div class="signin-container">
  <div class="user-ico-container">      
  <img src="assets/images/login/user.png" alt="User Avatar" class="avatar" />
      </div>
      <form [formGroup]="form" (ngSubmit)="go()">     
      <input placeholder="email" class="input-field"  [formControl]="form.controls.email"/>     
      <input placeholder="password" type="password"  class="input-field"  [formControl]="form.controls.password"/>    
      <button [disabled]="form.invalid">Login</button>              
          <div class="error">         
            {{this.form_error}}
          </div>         
  </form>
  <div>    
    <mat-list>     
        <mat-list-item>
        No Account? <a mat-line [routerLink]="['/signup']">Sign Up</a>
        </mat-list-item>
    </mat-list>
  </div>
  </div>

  `,
  styles: [`

    h2 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #333;
    }
    .signin-container {
      width: 100%;
      max-width: 420px;
      margin: 50px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 -4px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      flex-direction: column;
      align-items: center;
      
    }

    .signin-container  input {
      width: calc(100% - 20px);
      padding: 10px;
      margin-bottom: 15px; 
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 14px;
    }

    

    .input-field {
      width: calc(100% - 20px);
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 16px;
      outline: none;
      transition: border-color 0.3s ease;
    }

    .input-field:focus {
      border-color: #007BFF;
    }

    .signin-container button {
      width: calc(100% - 50%); 
      padding: 10px;
      background-color: #2669a0;
      color: #fff;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
      margin-top: 15px;
      box-sizing: border-box;
      font-family: Arial, sans-serif;
    }

  .signin-container button:hover {
    background-color: #0056b3;
  }
    .submit-button:disabled {
      background-color: #ccc;
    }

    .submit-button:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .user-ico-container {
      margin-bottom: 20px;
      display: flex;
    }

    .user-ico-container img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }



    `]
})
export class SigninComponent {
  #users_service = inject(UsersService);
  #state = inject(StateService);
  #router = inject(Router);
  form_error : string | null = null;

  form = inject(FormBuilder).nonNullable.group({
    'email': ['', Validators.required],
    'password': ['', Validators.required],
  });

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      this.form_error = null;   
      if (this.form.controls.email.errors?.['required']) {
        this.form_error = 'Email is required.';
        return; 
      }
  
      if (this.form.controls.password.errors?.['required']) {
        this.form_error = 'Password is required.';
        return; 
      }    
  
    });
  }

  go() {
      this.#users_service.signin(this.form.value as User).subscribe(response => {
      const decoded = jwtDecode(response.data.token) as Token;
     // console.log("Role in SIGN IN *********" + decoded.role.toLocaleLowerCase().trim())
      this.#state.$state.set({
        _id: decoded._id,
        name: decoded.name,
        email: decoded.email,
        jwt: response.data.token,
        role: decoded.role
      });
      this.#router.navigate(['', 'pets']);
    },
    error => {
      if (error.status === 401) {
        this.form_error = 'Unauthorized user. Please check your credentials.';
      } else if (error.toString().includes('duplicate')) { 
        this.form_error = 'This email is already in use.';
      }else if (error.status === 404) { 
        this.form_error = 'User Name or password is incorrect.';
      }      
      else {     
        this.form_error = environment.INTERNAL_ERROR;
      }    
    });
  }

}
