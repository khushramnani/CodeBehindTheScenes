import asynHandler from "../utils/asynchandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/Users.modals.js"
import jwt from "jsonwebtoken"



const verifyJwt = asynHandler(async(req, res, next)=>{
   try {
     const token = req.cookies?.accessToken
 
     if (!token) {
        throw new ApiError(401 , "Unauthorise user")
     }
 
     const decodeToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(decodeToken._id)
 
     if (!user) {
       throw  new ApiError(400,"Invalid access token ")
     }
 
     req.user = user
     next()
   } catch (error) {
    throw new ApiError(400 ,error?.message || "invalid access token")
   }

})

export {verifyJwt}