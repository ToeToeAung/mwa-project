import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { initial_state, StateService } from './state.service';
import { HeaderComponent } from './header.component'
import { FooterComponent } from './footer.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, HeaderComponent, FooterComponent],
  template: `      
    <!-- {{state_service.isLoggedIn()}} -->
    @if(state_service.isLoggedIn()){
      <app-header></app-header> 
      <router-outlet />
      <app-footer></app-footer>      
    }@else {    
      <router-outlet />     
       <a [routerLink]="['','home']"></a> 
    }    
  `,
  styles: [`
      a{margin-right: 10px}    
  
    `],
})
export class AppComponent {
  title = 'Smart Pet Adoption App';
  state_service = inject(StateService);
  #router = inject(Router);

  // signout() {
  //   this.state_service.$state.set(initial_state);
  //   this.#router.navigate(['', 'signin']);
  // }

}
