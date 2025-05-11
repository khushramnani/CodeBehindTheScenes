

import mongoose, { connections } from "mongoose";
import { DBName } from "../constants.js";


const ConnectDB  = async ()=>{

    try {
         const Connection = await mongoose.connect(`${process.env.MONGO_DB_URI}/${DBName}`)
        console.log(`MONGO DB CONNECTED SUCCEFULY AT ${Connection.connection.host}`);
        
    } catch (error) {
        console.log(`ERROR:`,error);
        // throw error
        process.exit(1)
        
    }
}

export default ConnectDB