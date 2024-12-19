import { Component,inject,signal } from '@angular/core';
import { FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatPaginator  } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'; 
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';

import { PetService } from './pet.service';
import { Pet,SearchData,AgeLevel,Kind} from './pet.type';
import { StateService } from '../state.service';
import { response } from 'express';


@Component({
  selector: 'app-recommand',
  standalone : true,
  imports: [CommonModule,MatTableModule,MatSort,MatPaginator,RouterModule,FormsModule, ReactiveFormsModule,MatPaginatorModule],
  template: `
   <div class="recommad-container">  
   <h2>Pet Recommendation powered by AI </h2>
   <form [formGroup]="form">
   <div class="container">
    <div class="row">      
      <label for="kind" class="col-sm-1 mt-3">Kind of pet :</label>
      <select id="kind" [formControl]="form.controls.kind" class="col-sm">
      <option *ngFor="let kind of kindOptions" [value]="kind">{{ kind }}</option>
      </select>
      <label for="age" class="col-sm-1 mt-3">Age :</label>
      <select id="age" [formControl]="form.controls.age" class="col-sm">
      <option *ngFor="let age of ageOptions" [value]="age">{{ age }}</option>
      </select>
      <textarea  placeholder="Your Preferences ..." [formControl]="form.controls.preference" class="col-sm-6 mt-3"></textarea>
      <button class="col-sm" (click)="onSearch()"> Ask AI </button>
      </div>
    </div>
    </form>
</div>
    <div class="list-container">
      <div class="title-container">      
      <h2>Best Match Pet List</h2>
      </div>
      <table mat-table [dataSource]="petsDataSource" matSort>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Name </th>
          <td mat-cell *matCellDef="let pet"> <a [routerLink]="['/pets', pet._id]" target="_blank">{{ pet.name }}</a> </td>
        </ng-container>
        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef> Description </th>
          <td mat-cell *matCellDef="let pet"> {{ pet.description }} </td>
        </ng-container>
       
        <ng-container matColumnDef="kind">
          <th mat-header-cell *matHeaderCellDef> Kind </th>
          <td mat-cell *matCellDef="let pet"> {{ pet.kind }} </td>
        </ng-container>

        <ng-container matColumnDef="age">
          <th mat-header-cell *matHeaderCellDef> Age </th>
          <td mat-cell *matCellDef="let pet"> {{ pet.age }} </td>
        </ng-container>
        <ng-container matColumnDef="breed">
          <th mat-header-cell *matHeaderCellDef> Breed </th>
          <td mat-cell *matCellDef="let pet"> {{ pet.breed }} </td>
        </ng-container>
        <!-- <ng-container matColumnDef="image_path">
          <th mat-header-cell *matHeaderCellDef> Image Path </th>
          <td mat-cell *matCellDef="let pet"> {{ pet.image_path }} </td>
        </ng-container> -->
        <tr mat-header-row *matHeaderRowDef="displayedColumns" mat-sort-header></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <mat-paginator [length]="petsDataSource.data.length" [pageSize]="3"></mat-paginator> 
  </div>

  `,
  styles: [`
   .recommad-container{            
        width: 80%;
        margin: 20px auto;
        padding: 20px 30px 20px 20px;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 -4px 8px rgba(0, 0, 0, 0.1);     
       }

       .list-container{            
        width: 80%;
        margin: 20px auto;
        padding: 20px 30px 20px 20px;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 -4px 8px rgba(0, 0, 0, 0.1);     
       }

    `]
})

export class RecommandComponent {
  #state_service = inject(StateService);
  #storedState = sessionStorage.getItem('SPA_APP_STATE');
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  recommendedPets: Pet[] = [];
  kindOptions = Object.values(Kind);
  ageOptions = Object.values(AgeLevel);
  form_error : string | null = null;
  #petService = inject(PetService);
  
  pets = signal<Pet[]>([]);
  petsDataSource = new MatTableDataSource<Pet>([]);
  displayedColumns: string[] = ['name', 'description','kind','age','breed'];

  constructor(private petService: PetService) { 
  //  this.loadPets();
  }
    form = inject(FormBuilder).nonNullable.group({
      '_id': ['', Validators.required],     
      'kind': [Kind.Any, Validators.required],     
      'age': [AgeLevel.Any, [Validators.required,Validators.pattern(/^\d+$/)]],    
      'preference': ['', Validators.required],     
    });

  ngOnInit(): void {
  }

  loadPets(): void {
    this.#petService.get_pets().subscribe(response => {
        if (response.success) {
        this.pets.set(response.data);
        this.petsDataSource.data = response.data;
      }
    });  
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.petsDataSource.paginator = this.paginator;
    } else {
      console.warn('Paginator not found!');
    }

    if (this.sort) {
      this.petsDataSource.sort = this.sort;
    } else {
      console.warn('Sort not found!');
    }
  }
  
  onSearch(): void {
    let userId;
   if (this.#storedState) {
        const parsedState = JSON.parse(this.#storedState);
        userId=parsedState._id;  
    }
        const searchData: SearchData = {
        kind: this.form.controls.kind.value,
        age: this.form.controls.age.value,
        preferences: this.form.controls.preference.value,
        userId: userId
      };
            

      this.#petService.recommand_pet(searchData).subscribe(response => {
    //    console.log("recommand_pet" + JSON.stringify(response.data))
        if (response.success) {
          this.pets.set(response.data);
          this.petsDataSource.data = response.data;
        }
      });   
   }

 

}

