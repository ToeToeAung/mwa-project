import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from './users.service';
import { Router } from '@angular/router';
import { Role } from './user.type';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule,CommonModule],
  template: `  
    <form [formGroup]="form" (ngSubmit)="go()" class="signup-container">     
       <div class="image-container ">
        <img src="assets/images/login/signup.png" alt="Signup"/>
        <h2 class="signup-text">Sign up</h2>
      </div>
      <label></label>
      <label for="name">Name :</label>
      <input placeholder="name" [formControl]="form.controls.name"/>
      <label for="email">Email :</label>
      <input placeholder="email" [formControl]="form.controls.email"/>    
      <label for="password">Password :</label>
      <input placeholder="password" type="password" [formControl]="form.controls.password"/>
      <label for="role">Role :</label> 
      <select id="role" [formControl]="form.controls.role">
      <option *ngFor="let role of roleOptions" [value]="role">{{ role }}</option>
      </select>
      <label  for="address">Address :</label>
      <input placeholder="address" [formControl]="form.controls.address"/> 
      <label for="phone">Phone :</label>
      <input placeholder="phone" [formControl]="form.controls.phone"/>      
      <button [disabled]="form.invalid">Create Account</button>
      <div class="error" style="grid-column: 2;">         
            {{this.form_error}}
       </div>
    </form>

  `,
  styles:[`     
      .signup-container {        
        display: grid; 
        grid-template-columns: 150px 1fr; 
        gap: 10px 20px;
        width: 50%;
        margin: 20px auto;
        padding: 20px 30px 20px 20px;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
       }

       .image-container {
        display: flex; 
        align-items: center;
        margin-bottom: 20px; 
        justify-content: center;
        }

        .image-container img {
          width: 50px; 
          height: 50px;
          margin-right: 10px; 
        }

        .signup-text {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
 
        label {
          text-align: right;
          font-weight: bold;
          align-self: center; 
        }


        input ,select{
          width: 40%; 
          padding: 8px;
          font-size: 14px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }

              
        input[type="file"] {
          padding: 2px; 
          width: 40%; 
        }

        input[type='checkbox'] {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }    
    `]
})
export class SignupComponent {
 // #profile_picture!: File;
  #users_service = inject(UsersService);
  #router = inject(Router);
  roleOptions = Object.values(Role);
  form_error : string | null = null;

  form = inject(FormBuilder).nonNullable.group({
    'name': ['', Validators.required],
    'email': ['', [Validators.required, Validators.email]],   
    'password': ['', Validators.required],
    'role': [Role.Seeker, Validators.required],
    'address': ['', Validators.required],
    'phone': ['', Validators.required] 
    // 'file': ['', Validators.required],
   
  });


  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      this.form_error = null;   
      if (this.form.controls.name.errors?.['required']) {
        this.form_error = 'Name is required.';
        return; 
      }

      if(this.form.controls.email.hasError('email')){
        this.form_error = 'Invalid email format';
        return; 
      }

      if (this.form.controls.email.errors?.['required']) {
        this.form_error = 'Email is required.';
        return; 
      }  

      if (this.form.controls.password.errors?.['required']) {
        this.form_error = 'Password is required.';
        return; 
      }    

      if (this.form.controls.role.errors?.['required']) {
        this.form_error = 'role is required.';
        return; 
      }

      if (this.form.controls.phone.errors?.['required']) {
        this.form_error = 'Phone is required.';
        return; 
      }

      if (this.form.controls.address.errors?.['required']) {
        this.form_error = 'Address is required.';
        return; 
      }    
  
    });
  }

  // pickup_file(event: any) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files!.length) {
  //     this.#profile_picture = input.files![0];
  //   }

  // }
  
  go() { 
    const formData = new FormData();
    formData.append('name', this.form.controls.name.value);
    formData.append('email', this.form.controls.email.value);
    formData.append('password', this.form.controls.password.value);
    formData.append('role', this.form.controls.role.value);
    formData.append('address', this.form.controls.address.value);   
    formData.append('phone', this.form.controls.phone.value);   
    this.#users_service.singup(formData).subscribe(response => { 
      alert("User has been created successfully.")
      this.#router.navigate(['', 'signin']);
    },
    (error) => {      
      console.error('Signup failed:', error);
      if (error.toString().includes('duplicate')) { 
        this.form_error = 'This email is already in use.';
      } else {
        this.form_error = environment.INTERNAL_ERROR;
      }         
    }
  );
  }
}
