import asynHandler from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {User} from "../models/Users.modals.js"
import {uploadFileOnCloudinary} from "../utils/cloudinary.js"
const registerUser = asynHandler(async (req , res)=>{
// get user data from frontend 
// validation - not empty
// check if user already exists username , email 
// check for image , avatar
// upload them to cloudinary
// create user object on db for entry
// remove password and refersh token from response 
// check for user creation 
// return res 

const {fullname , email , username , password  } = req.body
console.log("username" , username , "email" , email );

// if(!fullname || !email || !username || !password){
//     throw new ApiError("Please provide all fields" , 400)
// }

if (
    [fullname , username , email , password].some((fields)=> fields.trim() === "" )
) {
    throw new ApiError(400 , "All Fields are required")
}

const checkExistedUser = await User.findOne({
    $or: [{username},{email}]
})

if (checkExistedUser) {
    throw new ApiError(409 , "User Already Exist")
}



// check for image , avatar

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if (!avatarLocalPath) {
    throw new ApiError(400 , "Avatar is required")
}

const avatar = await uploadFileOnCloudinary(avatarLocalPath)

const coverImage = await uploadFileOnCloudinary(coverImageLocalPath)

if (!avatar || !avatar.url) {
    throw new ApiError(400 , "Avatar is not uploaded")
}



    const createUser = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        avatar: avatar.url,
        coverimage: coverImage?.url || ""  
    });
    



const checkUserCreated = await User.findById(createUser._id).select(
    "-password -refreshtoken"  // removed in res
)

console.log("new user id " , createUser._id);


if (!checkUserCreated) {
    throw new ApiError(500 , "Something went wrong on user creation")
}


return res.status(201).json(
   new ApiResponse(200 , createUser , "User Created Successfully")
)

})

export {registerUser}