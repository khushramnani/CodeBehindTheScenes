import { Router } from "express"
import { accessRefreshToken, getUserDetails, loginUser, logOutUser, registerUser, updatePassword, updateUserAvatar, updateUserCoverImage, updateUserProfile } from "../controllers/user.conrollers.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"


const userRouter = Router()

// post

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


// update (patch)

userRouter.route("/change-user-password").patch(
    verifyJwt,
    updatePassword)

userRouter.route("/update-user-details").patch(
    verifyJwt,
    updateUserProfile)

userRouter.route("/update-user-avatar").patch(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    updateUserAvatar)

userRouter.route("/update-user-coverImage").patch(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    updateUserCoverImage)

// get 

userRouter.route("/get-user-details").get(
    verifyJwt,
    getUserDetails)

export default userRouter