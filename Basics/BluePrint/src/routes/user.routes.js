import { Router } from "express"
import { registerUser } from "../controllers/user.conrollers.js"

const userRouter = Router()

userRouter.route("/register").post(registerUser)
// http://localhost:5000/api/v1/user/register



export default userRouter