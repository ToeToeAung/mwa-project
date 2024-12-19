import { RequestHandler } from "express";
import { sign } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import { ErrorWithStatus, StandardResponse } from "../common.ts";
import { User, UserModel } from "./UserModel.ts";

export const signin: RequestHandler<unknown, StandardResponse<{ token: string; }>, User, unknown> = async (req, res, next) => {
    try {
        
        const { email, password } = req.body;
        console.log(req.body)
        const user = await UserModel.findOne({ email });
        if (!user) throw new ErrorWithStatus('User not found', 404);

        if (!password) throw new ErrorWithStatus('Password not found', 404);
        const match = await compare(password, user.password);
        if (!match) throw new ErrorWithStatus('Passwords do not match', 401);

        if (!process.env.SECRET) throw new ErrorWithStatus('Secret not found', 401);

        const token = sign({
            _id: user._id,
            name:user.name,
            email: user.email,
            role:user.role,
        }, process.env.SECRET);

        res.status(200).json({ success: true, data: { token } });
        
    } catch (err) {
        next(err);
    }
};
export const signup: RequestHandler<unknown, StandardResponse<string>, User, unknown> = async (req, res, next) => {
    try { 
        const new_user = req.body;

        console.log(" new_user  ***" +JSON.stringify(new_user))
        if (!new_user.password) throw new Error('Password is required');
        const hashed_password = await hash(new_user.password, 10);

        const results = await UserModel.create({
            ...req.body,
            password: hashed_password
        });

        res.status(201).json({ success: true, data: results._id.toString() });

    } catch (err) {
        next(err);
    }
};

export const upload_picture: RequestHandler<unknown, StandardResponse<String>> = async (req, res, next) => {
    try {
        console.log (req.headers);
        console.log (req.file);
        const results = await UserModel.updateOne(
            { _id: req.user?._id },
            { $set: { picture: req.file?.path } });
        res.json({ success: true, data: '' });
        console.log(results)
    } catch (e) {
        next(e);
    }
};

export const listUsers: RequestHandler<{ role?:string} , StandardResponse<User[]>
            , unknown, unknown> = async (req, res, next) => {

   try { 
        let query = {} 
        let page = 0
        
        if (req.params.role){
            query  = {... query, role: req.params.role} ;
        } 
        console.log(query) ;
        console.log(req.params ) ;
        const results = await UserModel
            .find(query
                ,{_id: 1, name:1,email:1,role:1})
        res.status(200).json({ success: true, data: results });

    } catch (err) {
        next(err);
    }

                     
};