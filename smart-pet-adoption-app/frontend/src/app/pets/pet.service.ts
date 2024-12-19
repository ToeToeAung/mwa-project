import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AgeLevel, Pet, SearchData } from './pet.type';
import { Kind } from './pet.type';

export interface StandardResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})

export class PetService {
  #http = inject(HttpClient);

  get_pets() {
    return this.#http.get<StandardResponse<Pet[]>>(environment.SERVER_URL + 'pets');
  }

  get_pets_byowner(ownerId : string) {  
    return this.#http.get<StandardResponse<Pet[]>>(environment.SERVER_URL + 'pets/'+`${ownerId}`);
  }

  get_pet(pet_id: string) {
    return this.#http.get<StandardResponse<Pet>>(environment.SERVER_URL + `pets/${pet_id}`);
  }

  post_pet(data: FormData) {  
    return this.#http.post<{ success: boolean, data: string; }>(environment.SERVER_URL + 'pets/', data);
  }

  adopt_pet(pet: Pet) {    
    return this.#http.put<StandardResponse<number>>(environment.SERVER_URL + `pets/${pet._id}`, pet);
  }
  
  put_pet(pet_id:string,data: FormData) {  
    return this.#http.put<{ success: boolean, data: string; }>(environment.SERVER_URL + `pets/${pet_id}`, data);
  }

  delete_pet(pet_id: string) {
    return this.#http.delete<StandardResponse<number>>(environment.SERVER_URL + `pets/${pet_id}`);
  }

  recommand_pet(searchData : SearchData){
     return this.#http.get<StandardResponse<Pet[]>>(environment.SERVER_URL + 'pets/recommend', {
      params: searchData
    });
  }
  
}
