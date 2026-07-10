import { Router } from "express";
import { registerUser, logInUser ,logOutUser,refreshAccessToken,changeCurrentPassword, getCurrentUser, updateAccountDetails,    UpdateUserAvatar, UpdateCoverImage} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.models.js";
const router=Router()


 // now if the route matches register we will call this function or controller whcih we have imported
// ✅ CORRECT: Chain the .post() method to the route map
// impemented middlewares for uploading avatar and cover image.
router.route("/register").post( 


     upload.fields([
        {                              
            name: "avatar",
            maxCount:1
        },
        {
            name: "coverImage",
            maxCount:1,   

        }
     ])
    ,registerUser);


    // secured routes
    router.route("/login").post(logInUser);

   
    router.route("/LogOut").post(verifyJwt,logOutUser)  // for log out we will use a middleware verify jwt.

    router.route("/refresh-token").post(refreshAccessToken);

    router.route("change-password").post(verifyJwt,changeCurrentPassword)

    router.route("get-user").post(verifyJwt, getCurrentUser)

    router.route("update-account-details").post(verifyJwt,  updateAccountDetails)

    router.route("change-avatar-image").post(
         upload.fields([
        {                              
            name: "avatar",
            maxCount:1
        },
    ])
    ,verifyJwt, UpdateUserAvatar);

     router.route("change-cover-image").post(
         upload.fields([
        {                              
            name: "coverImage",
            maxCount:1
        },
    ])
    ,verifyJwt, UpdateCoverImage);
    




export default router


 
