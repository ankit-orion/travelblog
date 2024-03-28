import {Router} from "express";
import { loginUser,
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails, 
    updateUserAvatar
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

// here we are creating routes
// register route will direct us to register user method
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        }      
    ]),
    registerUser
)

// loegin route will redirect us to loginUser method
router.route("/login").post(loginUser)

// secured routes
// here verifyJWT method or middleware will run 
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

// since only verified person can logout se we need to pass verifyJwt middleware
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
export default router