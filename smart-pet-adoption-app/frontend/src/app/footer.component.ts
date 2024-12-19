import { Component,inject } from '@angular/core';
import { Router } from '@angular/router';
import { initial_state, StateService } from './state.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
<footer class="footer-container">   
 <button (click)="goBack()">Back</button>   
  @if(state_service.isLoggedIn()){
  <button (click)="signout()">Log out</button>   
  }   
</footer>
  `,
  styles: [`
      .footer-container {
      background-color: #fff;
      display: flex;
      justify-content: right;

      align-items: center;
      padding: 10px;
      color: white;
      height: 10vh;  
       gap: 10px;
    }
 
    `]
})
export class FooterComponent { 
  state_service = inject(StateService);
  #router = inject(Router);
    constructor(private router: Router, private location: Location) {
 
    }
    
    signout() {     
      localStorage.clear();
      this.state_service.$state.set(initial_state);
      this.#router.navigate(['', 'home']);
    }

    goBack(): void {
      this.location.back();  
    }
  
}