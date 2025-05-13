import { Router } from "express"
import { registerUser } from "../controllers/user.conrollers.js"
import {upload} from "../middlewares/multer.middleware.js"


const userRouter = Router()

userRouter.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "cover", maxCount: 1 }
    ]),
    registerUser)
// http://localhost:5000/api/v1/user/register



export default userRouter