
// require('dotenv').config({path:'./env'})
import ConnectDB from "./db/index.js";
import dotenv from 'dotenv'
import { app } from "./app.js";




ConnectDB()
.then(()=>{
    app.listen(process.env.PORT , ()=>{
        console.log(`server is listing on port ${process.env.PORT}`);
        
    })


})
.catch((err)=> err)