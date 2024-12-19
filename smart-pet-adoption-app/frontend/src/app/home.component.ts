import { Component,inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {initial_state, StateService } from './state.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  template: `     
     <div class="homepage-container">
     <h1> Welcome to Smart Pet Adoption!</h1>     
      <div class="right-align">
        <a routerLink="/signin">Sign in here!</a>
      </div>
      <div class="hero-image">
      <img src="/assets/images/home/home.jpg" alt="Hero Image">
  </div>
    </div>
  `,
  styles: [`
       .homepage-container {
      width: 100%;
      max-width: 70%;
      margin: 50px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 -4px 8px rgba(0, 0, 0, 0.1);    
      flex-direction: column;
      align-items: center;      
    }

    .right-align {
      text-align: right;
    }

    .hero-image {
    margin-top: 20px;
   }

    .hero-image img {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 10px;
    }
    `]
})
export class HomeComponent {
  title = 'Homepage';
  state_service = inject(StateService);

  ngOnInit() {
    sessionStorage.clear();
    this.state_service.$state.set(initial_state);
  }
}
