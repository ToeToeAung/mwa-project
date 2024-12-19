import { Schema, model, InferSchemaType, pluralize } from 'mongoose';


const petSchema = new Schema({
    name:{ type: String, required:true },
    kind: { type: String, enum : ['Dog','Cat','Hamster'], required:true},
    breed: {type:String, default:'unknown' } ,
    age: Number,
    gender:{ type: String, enum : ['Male','Female']},
    description: String,
    embeddedDescription:[Number],
    image_path: { type: String, default:''},
    sterilized: Boolean,
    ownerId: { type: String, default:''}
}, { timestamps: true, versionKey: false })  

type fullPet = InferSchemaType<typeof petSchema>;
 type InternalPet = {
    _id?:string,
    name?: string,
    kind?: string,
    breed?: string,
    age?: Number,
    gender?:string,
    description?: string,
    embeddedDescription:[Number],  //just internal
    image_path?: string,
    sterilized: boolean,
    ownerId?:string
}

export type Pet = Omit<InternalPet,'embeddedDescription'>; 

export const PetModel = model<InternalPet>('pet', petSchema);


