import { Schema, model, InferSchemaType, pluralize } from 'mongoose';


const userSchema = new Schema({
    name: { type: String, required:true },
    email: { type: String, unique: true, required:true },
    password: String,
    role: { type: String, enum : ['ShelterAdmin','PetSeeker'], default:'PetSeeker'},
    address: String ,
    phone: String,
    profile_picture:String,
}, { timestamps: true, versionKey: false });

//type fullUser = InferSchemaType<typeof userSchema>;
export type User = { name: string,
    email: string,
    password: string,
    role: string,
    address?: string ,
    phone?: string,
    profile_picture?:string,
}
export const UserModel = model<User>('user', userSchema);
