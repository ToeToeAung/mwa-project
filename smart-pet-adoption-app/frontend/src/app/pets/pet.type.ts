export type Pet = {
    _id: string | null,
    name : string,
    kind: Kind,
    breed: string ,    
    age: number,
    gender:Gender,
    description: string,
    image_path: string| null,
    sterilized: boolean,
    ownerId : string | null,
};

export enum Gender {
    Male = 'Male',
    Female = 'Female',
  }


export enum Kind{
    Any ="Any Pet",  
    Dog = 'Dog',
    Cat = 'Cat',
    Hamster ='Hamster', 
   
}

export enum AgeLevel{
    Any ='Any Age',
    Junior = 'Junior',
    Middle = 'Middle',
    Senior = 'Senior',   
}

export type SearchData = {
    kind : string,
    age : string,
    preferences : string,
    userId? : string 
}
