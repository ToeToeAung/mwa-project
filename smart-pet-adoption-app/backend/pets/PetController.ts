import { RequestHandler } from "express";
import { ErrorWithStatus, StandardResponse } from "../common.ts";
import { Pet, PetModel} from "./PetModel.ts";
import OpenAI from "openai";
const openai = new OpenAI();


const PAGE_SIZE = 100;
export const newPet: RequestHandler<unknown, StandardResponse<Pet>
            , Pet, unknown> = async (req, res, next) => {
    try { 

            if (!req.body.name) 
                throw new ErrorWithStatus('Name is required',403);
            let new_pet = {...req.body, ownerId:'-'};         

            if (req.file){
                new_pet = {...new_pet, image_path:req.file.path}
            }         
            const results = await PetModel.create(new_pet);
            const pet: Pet = {
                            _id: results._id,
                            name: results.name,
                            kind: results.kind,
                            breed: results.breed,
                            age: results.age,
                            gender: results.gender,
                            description: results.description,
                            sterilized: results.sterilized,
                            image_path: results.image_path!,
            }
            res.status(201).json({ success: true, data: pet });
            // asyng update embeddings
            generatePetEmbeding(pet);
            
        } catch (err) {
            next(err);
        }

                    
};

export const updatePet: RequestHandler<{petid:string}, StandardResponse<Pet>
            , Pet, unknown> = async (req, res, next) => {
    try {
        let updateImage = {}
        if (req.file) {
            updateImage = {image_path:req.file.path };
        }  

        if (Number(!req.params.petid)){
                throw new ErrorWithStatus('Id is required',401)
        } 

        const results = await PetModel.findOneAndUpdate({_id: req.params.petid}
            , {$set: {...req.body, ...updateImage}}
            , { returnDocument: "after", returnNewDocument: true }
        )
        if (results){ 
            const pet: Pet = {
                _id: results._id,
                name: results.name,
                kind: results.kind,
                breed: results.breed,
                age: results.age,
                gender: results.gender,
                description: results.description,
                sterilized: results.sterilized,
                image_path: results.image_path,
            };
            generatePetEmbeding(pet);
            return res.status(200).json({success: true, 
                data: pet});
        } else {
            throw new ErrorWithStatus ('No pet updated',500);
        }
    } catch (err) {
        next(err);
    }
    
};

export const deletePet: RequestHandler<{petid:string}, StandardResponse<number>
            , unknown, unknown> = async (req, res, next) => {
    try { 
        let query = {} 
        let page = 0
        
        if (Number(!req.params.petid)){
            new ErrorWithStatus('Id is required',403)
        } 
        const results = await PetModel
            .deleteOne({_id:req.params.petid});
        res.status(200).json({ success: true, data: results.deletedCount });

    } catch (err) {
        next(err);
    }
            
    
};

export const listPets: RequestHandler<{page: number, ownerId:string} , StandardResponse<Pet[]>
            , Pet, unknown> = async (req, res, next) => {

   try { 
        let query = {} 
        let page = 0
        
        if (req.params.ownerId){
            query  = {... query, ownerId: req.params.ownerId} ;
        } else {
          //  query  = {... query, ownerId:'-'} ; 
        } 
        if (Number(req.params.page)){
            page=Number(req.params.page)-1;
        } 
        const results = await PetModel
            .find(query
                ,{_id: 1, name:1,kind:1,breed:1,age:1,gender:1,
                    description:1,sterilized:1,image_path:1,ownerId:1})
            .skip(page*PAGE_SIZE)
            .limit(PAGE_SIZE);
        res.status(200).json({ success: true, data: results });

    } catch (err) {
        next(err);
    }

                     
};


async function generatePetEmbeding(pet: Pet){
    const text = 'I am a ' +pet.age + ' years old ' +pet.gender! + ' ' + pet.breed! + ' ' +
    pet.kind + '.' + pet.description;
    
    const embedding =   (pet.ownerId) ? await generateEmbedding(text)
    : [];
    
    PetModel.updateOne({_id: pet._id}
        , {$set: { embeddedDescription: embedding }}
    ).then(res => 
        console.log( 'emeddings updated ' + pet._id! + ":" + text)
    ).catch(error=>console.log(error));
}


async function generateEmbedding(input: string):Promise<number[]> {

    const vectorEmbedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input 
    });
     //console.log({
     //dimensions: vectorEmbedding.data[0].embedding.length, // 1536 dimentions
     //});
    return vectorEmbedding.data[0].embedding;
}

async function sumarizePetsforUser(userId: string):Promise<string> {
    
    const results = await PetModel.aggregate([
            {
            "$match": { ownerId: userId                    
            }
            },
            {
            '$group': {_id: '$kind' ,
                    'numberofPets':  {$sum:1} }
            }
           ]);
           console.log (results)
           let text = 'home with '
           for (let p of results) {
                text += p.numberofPets + " " + p._id
           }
    return "";
    
}

export const recommendPet: RequestHandler<unknown , StandardResponse<Pet[]>
            ,unknown,  {kind: string, age:string , preferences:string}> = async (req, res, next) => {

   try { 
        let text = '' ;
        const { kind, age, preferences } = req.query;
        if (kind && age){
            text  = text + ' I am looking for ' +
            (age === "Any Age" ? "":  age ==="junior" ? "new born" :
                age === "Middle" ? "adult" : age) 
            + ' ' + ( kind=="any"? "any pet": kind ); 
        } 
        if (req.user.role === "PetSeeker"){
            
            const myStatus= await sumarizePetsforUser(req.user._id);

            text  = text + myStatus 

        }
        text = text + ' ' + preferences
       
       console.log (' Recommending to: '+  text);
        const embeddedQuery = await generateEmbedding(text);
    
        const results = await PetModel.aggregate([
            {
            "$vectorSearch": {
                    "queryVector": embeddedQuery,
            "path": "embeddedDescription",
            "numCandidates": 20,
            "limit": 3,
            "index": "vector_index",
           // "filter": {
           //     ownerId: { "$eq": "-" }
           // },
            }
            },
            {
            '$project': {_id: 1, name:1,kind:1,breed:1,age:1,gender:1,
                description:1,sterilized:1,image_path:1}
            }
           ]);
           for (let p of results) {
                console.log (p.name);
           }
        res.status(200).json({ success: true, data: results });

    } catch (err) {
        next(err);
    }

                     
};
