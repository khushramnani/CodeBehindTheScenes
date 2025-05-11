import express from "express"
import cors from 'cors'
// const cors = require('cors')
// const cookieParser = require('cookie-parser')
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}))  // use to handle the cors 

app.use(express.json({limit:"16kb"})) // use to except the json data from request 
app.use(express.urlencoded({extended:true , limit:"16kb"})) // use to pass the data through url 
app.use(express.static("public"))   // use to store files on server on spefic folder like public 
app.use(cookieParser()) // user ke browers se cookies ko set or access karne ke liye help hota hai 

// user routes
import userRouter from "./routes/user.routes.js"

// route declaration

app.use("/api/v1/user" , userRouter)

// http://localhost:5000/api/v1/user

export  {app}