import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PetService } from './pet.service';
import { Pet } from './pet.type';
import { Gender } from './pet.type';
import { Router } from '@angular/router';
import { Kind } from './pet.type';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule,CommonModule],
  template: `
     <form [formGroup]="form" (ngSubmit)="go()" class="add-container">
       <div class="image-container">
        <img src="assets/images/pets/addPet.png" alt="Add Pet"/>
        <h2 class="h2-text">Add Pet</h2>
      </div>
      <label></label>
      <!-- <label for="id">ID :</label>
      <input placeholder="id" [formControl]="form.controls._id"/> -->
      <label for="name">Name :</label>
      <input placeholder="name" [formControl]="form.controls.name"/>
      <label for="kind">Kind :</label>
      <!-- <input placeholder="kind" [formControl]="form.controls.kind"/> -->
      <select id="kind" [formControl]="form.controls.kind">
      <option *ngFor="let kind of kindOptions.slice(1)" [value]="kind">{{ kind }}</option>
      </select>

      <label for="breed">Breed :</label>
      <input placeholder="breed" [formControl]="form.controls.breed"/>

      <label for="age">Age :</label>
      <input placeholder="age" [formControl]="form.controls.age"/>
      <label for="gender">Gender :</label> 
      <select id="gender" [formControl]="form.controls.gender">
      <option *ngFor="let gender of genderOptions" [value]="gender">{{ gender }}</option>
      </select>
      <label for="description">Description :</label> 
      <input placeholder="description" [formControl]="form.controls.description"/>
      <label for="file">Profile Picture :</label>
      <input type="file" [formControl]="form.controls.file" (change)="pickup_file($event)"/>
      <label for="sterilized">Sterilized :</label> 
      <input placeholder="sterilized"  type="checkbox" [formControl]="form.controls.sterilized"/>
      <button [disabled]="form.invalid">Create Pet</button>
      <div class="error" style="grid-column: 2;">         
            {{this.form_error}}
       </div>
    </form>
  `,
  styles: [`      
 
      .add-container {        
        display: grid; 
        grid-template-columns: 150px 1fr; 
        gap: 10px 20px;
        width: 50%;
        margin: 20px auto;
        padding: 20px 30px 20px 20px;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 -4px 8px rgba(0, 0, 0, 0.1);     
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

        .h2-text {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }

 
        label {
          text-align: right;
          font-weight: bold;
          align-self: center; 
        }


        input, select {
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

export class AddComponent {
  #profile_picture!: File;
  #petService = inject(PetService);
  #router = inject(Router);
  genderOptions = Object.values(Gender);
  kindOptions = Object.values(Kind);
  form_error : string | null = null;

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      this.form_error = null;   
      if (this.form.controls.name.errors?.['required']) {
        this.form_error = 'Name is required.';
        return; 
      }

      if (this.form.controls.kind.errors?.['required']) {
        this.form_error = 'Kind is required.';
        return; 
      }  

      if (this.form.controls.breed.errors?.['required']) {
        this.form_error = 'Breed is required.';
        return; 
      }    

      if (this.form.controls.age.errors?.['required']) {
        this.form_error = 'Age is required.';
        return; 
      }

      if (this.form.controls.age.errors?.['pattern']) {
        this.form_error  = `Invalid format for age.`;
        return; 
      }

      if (this.form.controls.age.value === 0) {
        this.form_error  = `Age should not be 0.`;
        return; 
      }

      if (this.form.controls.gender.errors?.['required']) {
        this.form_error = 'Gender is required.';
        return; 
      }

      if (this.form.controls.description.errors?.['required']) {
        this.form_error = 'Description is required.';
        return; 
      }    
  
      if (this.form.controls.sterilized.errors?.['required']) {
        this.form_error = 'Sterilized is required.';
        return; 
      }   

    });
  }

  form = inject(FormBuilder).nonNullable.group({
    'name': ['', Validators.required],
    'kind': [Kind.Dog, Validators.required],
    'breed': ['', Validators.required],
    'age': [0, [Validators.required,Validators.pattern(/^\d+$/)]],
    'gender': [ Gender.Female, Validators.required],
    'description': ['', Validators.required],
    'file': [''],
    'sterilized': [false, Validators.required]
  });

  pickup_file(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files!.length) {
      this.#profile_picture = input.files![0];
      console.log('Profile path' + this.#profile_picture.name)
    }
  }

  go() {  

    const formData = new FormData();
    formData.append('name', this.form.controls.name.value);
    formData.append('kind', this.form.controls.kind.value);
    formData.append('breed', this.form.controls.breed.value);
    formData.append('age', this.form.controls.age.value.toString());
    
    formData.append('gender', this.form.controls.gender.value);
    formData.append('description', this.form.controls.description.value);
  //  formData.append('profile_picture', this.#profile_picture);
    if (this.#profile_picture) {
      formData.append('profile_picture', this.#profile_picture);
    }  
    formData.append('sterilized', this.form.controls.sterilized.value.toString());
    formData.append('ownerId', '');
    
      this.#petService.post_pet(formData).subscribe(response => {
        console.log(" Pet Response "+ JSON.stringify(response))
      if (response.success) {
        alert("Pet has been created successfully.")
         this.#router.navigate(['', 'pets']);
      }
    });
  }
}
