import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatPaginator  } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'; 
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
//import { PetTestService } from './pet.service.test';
import { ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Pet } from './pet.type';
import { Role } from '../users/user.type';
import { MatIconModule } from '@angular/material/icon';
import { StateService } from '../state.service';
import { PetService } from './pet.service';


@Component({
  selector: 'app-list',
  imports: [CommonModule,MatTableModule,MatSort,MatPaginator,RouterModule,MatIconModule],
  template: `
    <div class="list-container">
      <div class="image-container">
      <img src="assets/images/pets/petList.png" alt="Pet List"/> 
      <h2>Pet List</h2>
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
        <ng-container matColumnDef="breed">
          <th mat-header-cell *matHeaderCellDef> Breed </th>
          <td mat-cell *matCellDef="let pet"> {{ pet.breed }} </td>
        </ng-container>
        <ng-container matColumnDef="kind">
          <th mat-header-cell *matHeaderCellDef> Kind </th>
          <td mat-cell *matCellDef="let pet"> {{ pet.kind }} </td>
        </ng-container>
        <ng-container matColumnDef="age">
          <th mat-header-cell *matHeaderCellDef> Age </th>
          <td mat-cell *matCellDef="let pet"> {{ pet.age }} </td>
        </ng-container>
        <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Actions </th>
        <td mat-cell *matCellDef="let pet">
        <ng-container *ngIf="isAdmin()">  

          <mat-icon 
          color="primary" 
          style="cursor: pointer;" 
          (click)="editPet(pet._id)">
          edit
        </mat-icon>

          <mat-icon 
          color="warn" 
          style="cursor: pointer;" 
          (click)="deletePet(pet._id)">
          delete
<         </mat-icon>
          </ng-container>
        </td>
       </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns" mat-sort-header></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <mat-paginator [length]="petsDataSource.data.length" [pageSize]="5"></mat-paginator> 
  </div>

  `,
  styles: [`
      h2 {
      font-size: 24px;
      margin-bottom: 10px;
      color: #333;
    }
      .list-container {
      width: 100%;
      max-width: 70%;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 -4px 8px rgba(0, 0, 0, 0.1);
      text-align: left;
      flex-direction: column;
      align-items: center;      
    }
       .image-container {
        display: flex; 
        align-items: center;
        margin-bottom: 20px; 
        justify-content: left;
        }

      .image-container img {
          width: 50px; 
          height: 50px;
          margin-right: 10px; 
          margin-left : 10px;
        }

      .list-container button {
      width: calc(100% - 50%); 
      padding: 10px;
      background-color:rgb(53, 108, 148);
      color: #fff;
      border: none;
      border-radius: 5px;
      font-size: 10px;
      cursor: pointer;
      margin-top: 0px;
      box-sizing: border-box;
      font-family: Arial, sans-serif;
    }

      button {
        max-width : 50px;
        max-height : 40px;
      }
      
      button mat-icon {
        max-width: 30px; 
        max-height: 20px;
      } 

      .mat-cell {
       vertical-align: top;
      }

      .action-buttons {
        display: flex;
        gap: 6px; 
      }
    `]
})
export class ListComponent {
  #state_service = inject(StateService);
  #router = inject(Router);
  #storedState = sessionStorage.getItem('SPA_APP_STATE');
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  #petService = inject(PetService);
  pets = signal<Pet[]>([]);
  petsDataSource = new MatTableDataSource<Pet>([]);
  displayedColumns: string[] = ['name', 'description','breed','kind','age','actions'];
  user_role :string | null = null; 
  admin_role = Role.Admin.toLocaleLowerCase();
  

  constructor(router: Router) {    
    this.#router = router; 
     this.loadPets();
  }

  loadPets(): void {
     if(this.isAdmin()){
      this.#petService.get_pets().subscribe(response => { 
        if (response.success) {
          this.pets.set(response.data);
          this.petsDataSource.data = response.data;
        }
      });  
    }else{
      if (this.#storedState) {
        const parsedState = JSON.parse(this.#storedState);
        const ownerId =  parsedState._id;      
        this.#petService.get_pets_byowner(ownerId).subscribe(response => {
        if (response.success) {
          this.pets.set(response.data);
          this.petsDataSource.data = response.data;
        }
      });  
    }
    }   
  }

 
  isAdmin(): boolean {
    if (this.#storedState) {
      const parsedState = JSON.parse(this.#storedState);
      const user_role = parsedState.role.toLocaleLowerCase().trim();         
      return user_role.toLocaleLowerCase() === this.admin_role.toLocaleLowerCase();
    }
    return false;
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


  add() {
    this.#router.navigate(['', 'pets', 'add']);
  }

  editPet(petId: string) {
    console.log('editPet')
    this.#router.navigate(['/pets/update', petId]);
   
  }

  deletePet(petId: string) {
    if (confirm('Are you sure you want to delete this pet?')) {
      console.log('petId in delete' + petId)
      this.#petService.delete_pet(petId).subscribe(
        () => {
          alert("Pet has been deleted successfully.")
          this.loadPets(); 
        },
        (error) => {
          console.error('Error deleting pet:', error);
        },
      );
    }
  }

}
