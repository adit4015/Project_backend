import { asyncHandler } from "../utils/asyncHandler";

import { ApiError } from "../utils/ApiError";
import jwt from  "jsonwebtoken"
import { User } from "../models/user.models";

// a middleware for checking if the user is still logged in and also provide the refrence to fetch database for log out controller

export const verifyJwt =asyncHandler(async(req,res) =>{
  try {
     const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","");
     console.log(token)
  
     if(!token)
         throw new ApiError(401,"Unauthorized access")
  
     const decodedToken =jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  
     // as access token has id as its field so we will reach or search the database through that id.
     const user=await  User.findByID(decodedToken?._id).select("-password -refreshToken")
  
     if(!user)
        throw new ApiError(402,"Invalid Access Token")
  
     // giving one more field to req so that we can use it in log out controller.
     req.user=user;
     
  }
   catch (error) {
          throw new  ApiError(401,error?.message || "Invalid Access Token")
    
  }
})