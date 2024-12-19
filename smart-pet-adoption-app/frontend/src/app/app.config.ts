import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { addTokenInterceptor } from './add-token.interceptor';
import { SigninComponent } from './users/signin.component';
import { StateService } from './state.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
//import { RecommandComponent } from './pets/recommand.component';
import { HomeComponent } from './home.component';

function initialize() {
  const state_service = inject(StateService);
  const state = sessionStorage.getItem('SPA_APP_STATE');
  if (state) {
    state_service.$state.set(JSON.parse(state));
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([addTokenInterceptor])),
    provideAppInitializer(initialize),
    provideRouter([
      { path: '', component: HomeComponent },
      { path: 'home', redirectTo: '', pathMatch: 'full' },      
      { path: 'signin', component: SigninComponent },     
      { path: 'about', loadComponent: () => import('./about.component').then(c => c.AboutComponent) },
      { path: 'signup', loadComponent: () => import('./users/signup.component').then(c => c.SignupComponent) },
      { path: 'pets/update/:id', loadComponent: () => import('./pets/update.component').then(c => c.UpdateComponent)},
      { path: 'pets/adopt', loadComponent: () => import('./pets/adopt.component').then(c => c.AdoptComponent) },
      { path: 'pets/recommend', loadComponent: () => import('./pets/recommand.component').then(c => c.RecommandComponent) },
      {
        path: 'pets', loadChildren: () => import('./pets/pets.routes').then(r => r.pets_routes),
        canActivate: [() => inject(StateService).isLoggedIn()]  
      },
      {
        path: 'pets/:id',loadComponent: () => import('./pets/detail.component').then(c => c.PetDetailComponent),
      }, { path: 'pets/add', loadComponent: () => import('./pets/add.component').then(c => c.AddComponent) }
    
      
    ]), provideAnimationsAsync(), provideAnimationsAsync()
  ]
};
