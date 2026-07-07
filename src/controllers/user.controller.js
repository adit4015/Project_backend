import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.models.js"
import { uploadoncloudinary } from "../utils/Cloudinary.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"



// a controller for registering
const registerUser= asyncHandler(async(req,res) =>{
    // get user details feom frontend (now from postman)
    // validation of all input (empty or not)
    // check if the user already exists in database or not. (username oe email -> if one of them is already there then already exist)
    //  check for images for images check for avatar( done in routes through middlewares)
    // now upload avatar and coverimage on cloudinary
    // create user.object (as mongodb is no sequential database hence we have to create a object )
    // create user object ->create entry in database (from user _>imported from user.model )
    // check for user creation -> if user is created in databse or not.
    // remove the password and refresh token from thw response sent by the database to frontend .
   // return the response from mongodb

  // 1. getting user details from frontend.
    const {fullName,email,username,password}=req.body
      console.log(req.body);
     
    //2. check validation for required fields.
    if(fullName=="")
        throw new   ApiError(409,"enter your full name")
    if(email=="")
        throw new   ApiError(409,"enter correct email")
    if(username=="")
        throw new ApiError(409,"enter correct username")
    if(password=="")
        throw new ApiError(409,"enter correct password")
    // if(!email.contains('@'))
    //     throw new ApiError(409,"enter correct format of email")

    // 3. checking if user is already there in database or not. (import user from model) just use or for email and username

    const existedUser=  await User.findOne({
                      $or:  [{ username }, { email }]
    })

    if(existedUser)
        throw new ApiError(409,"user already existed enter unique username and email")

    // 4. now checking for images ->multer provides additional fields to request -> it provides fields
    // and we check as req.files?.avatar[0]?.path ->used avatar[0] because we can use or fetch path from it.
    console.log(req.files)
  // fetching the local path to the avatar and coverimage which is currently on server

// we keep a check here  if we have not upload coverimage or avatar then it will give error as it will be empty so we will keep a check 
//

    let avatarLocalPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path
    }

    //const coverImageLocalPath=req.files?.coverImage[0]?.path;


    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    // now avatar is a required field so check for it 
    if(!avatarLocalPath)
        throw new ApiError(409,"avatar file is not uploaded on server") 

    // uploading on cloudinary  (avatar and coverimage)

    const avatar =  await uploadoncloudinary(avatarLocalPath);
    // if using const or another thing inside if, use curly braces
    const coverImage=await uploadoncloudinary(coverImageLocalPath);
    
    

    // now creating user object in mongodb as it may take time use await

    const user = await User.create({
        fullName,
        avatar:avatar.url,// extract url from the response return by cloudinary 
        coverImage:coverImage?.url || " ", // KEEP IN MIND THERE IS NO GAP BETWEEN ? AND .

        username:username.toLowerCase(),
        password,
        email
    })
    
    // now check if user is created or not by _id -> if we create any object in mongodb then mongodb create a _id for it we will check by it
   // here we also extract the password and refresh token from returning response by using select in this select we take all 
   // fileds by default we have to provide those fields which we dont want by response ans we have to maintain the space in string 
    const CreatedUser = await User.findById(user._id).select ("-password -refreshToken") 

    // now checkiing if bject is created in database or not
    if(!CreatedUser)
        throw new ApiError(500,"user is not registered")
    

    // returning the response from database for this import apiresponse.     
    return res.status(201).json(
        new Apiresponse(200,CreatedUser,"User Registered")
    )

   
})


// now for  just checking input taking from frontend(postman)




export {
    registerUser
}
