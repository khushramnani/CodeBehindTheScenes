import asynHandler from "../utils/asynchandler.js"


const registerUser = asynHandler(async (req , res)=>{
    res.status(200).json({
        message:"hello user",
        
    }) 
})




export {registerUser}