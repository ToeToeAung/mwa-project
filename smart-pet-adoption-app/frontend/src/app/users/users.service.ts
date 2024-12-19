import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from './user.type';
import { environment } from '../../environments/environment.development';

export interface StandardResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  #http = inject(HttpClient);

  signin(user: User) {
    return this.#http.post<{ success: boolean, data: { token: string; }; }>(environment.SERVER_URL + 'users/login', user);
  }

  singup(data: FormData) {  
    const formDataObject = Object.fromEntries(data.entries());   
    return this.#http.post<{ success: boolean, data: string; }>(environment.SERVER_URL + 'users/signup', formDataObject);
  }

  get_user(user_id: string) {
    return this.#http.get<StandardResponse<number>>(environment.SERVER_URL + `users/${user_id}`);
  }

  get_users(role : string) {
      return this.#http.get<StandardResponse<User[]>>(environment.SERVER_URL + 'users/?&role='+role);
  }
}
