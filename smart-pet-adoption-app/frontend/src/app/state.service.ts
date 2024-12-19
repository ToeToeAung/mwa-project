import { effect, Injectable, signal } from '@angular/core';
import { test_data } from './mock-data';

export type GlobalState = {
  name: string,
  email: string,
  _id: string,
  jwt: string;
  role :string;
};

export const initial_state = {
  name: '',
  email: '',
  _id: '',
  jwt: '',
  role : ''
};


@Injectable({
  providedIn: 'root'
})

export class StateService {
   $state = signal<GlobalState>(initial_state);
   //$state = signal<GlobalState>(test_data);
  
  spaEffect = effect(() => {
    sessionStorage.setItem('SPA_APP_STATE', JSON.stringify(this.$state()));    
  });

  isLoggedIn() {
 //   console.log("State " + JSON.stringify(this.$state) + this.$state()._id)
    return this.$state()._id ? true : false;
  }

 }
