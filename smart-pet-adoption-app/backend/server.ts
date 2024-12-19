import path from 'node:path';
import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import UserRouter from './users/UserRouter';
import { errorHandler, routerNotFoundHandler } from './common';
import { connect_db } from './db';
import PetRouter from './pets/PetRouter'

//import { checkToken } from './users/users.middleware';

//init application
dotenv.config();
const app = express();
connect_db();
console.log('Loading' + path.join(__dirname, 'pictures'))
// Configure the server
app.use(morgan('dev'));
app.use(cors());
//app.use('/pictures', express.static ('./pictures/'));
app.use('/pictures', express.static(path.join(__dirname, './pictures')));

app.use(json());

// configure the router
app.use('/users', UserRouter);
app.use('/pets', PetRouter);

// configure Error Handler

app.use(routerNotFoundHandler);
app.use(errorHandler);

// Bootup 

app.listen(3000, () => console.log(`Listening on 3000`));
