import { Router } from "express"
import { accessRefreshToken, loginUser, logOutUser, registerUser } from "../controllers/user.conrollers.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"


const userRouter = Router()

userRouter.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser)
// http://localhost:5000/api/v1/user/register

userRouter.route("/login").post(loginUser)

userRouter.route("/logout").post(
    verifyJwt,
    logOutUser
)

userRouter.route("/access-refresh-token").post(accessRefreshToken)

export default userRouter