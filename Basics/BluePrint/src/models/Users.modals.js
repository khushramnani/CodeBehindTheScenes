import mongoose from "mongoose";
import { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

const UserSchema = new Schema({
    username:{
        type:String,
        required: true,
        lowercase:true,
        trim: true,
        unique:true
    },
    password:{
        type:String,
        required:[true , 'password is required'],
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim: true,
    },
    fullname:{
        type:String,
        required: true,
        index:true
    },
    avatar:{
        type:String
    },
    coverimage:{
        type:String
    },
    watchhistory:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },
    refreshtoken:{
        type:String
    }
},{timestamps:true})


UserSchema.pre('save',function (next) {  // not use call back func becoz they dont provide ' this ' access 

    if(!this.isModified("password")) return next()   //we write this condition to bypass the password when anything is modified  

    this.password = bcrypt.hash(this.password , 10)  
    next()     // if we only write this it can create problem which when anything when we modify like avatar it also encrypt pass again and we dont want it  
})

UserSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password , this.password)  // this return true and false like match hua ki nahi hua 
}


UserSchema.methods.generateAccessToken = function () {
    jwt.sign({
        _id:this._id,
        username:this.username,
        fullname:this.fullname,
        email:this.email,
    },
        process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

UserSchema.methods.generateRefreshToken = function () {
    jwt.sign({
        _id:this._id,
        
    },
        process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}


export const User = mongoose.model('User',UserSchema)

