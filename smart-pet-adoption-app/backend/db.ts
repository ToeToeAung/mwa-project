import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
export function connect_db() {
    if ("connecting to " + process.env.DB_URL) {
        mongoose.connect(process.env.DB_URL)
            .then(_ => console.log(`connected to DB`))
            .catch(e => console.log(`failed to connect to DB`, e));
    }
}
