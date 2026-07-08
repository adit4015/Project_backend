import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.models.js"
import { uploadoncloudinary } from "../utils/Cloudinary.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
// for generating the tokens we have make a separate function because of high reusability.
const generateAccessAndRefreshTokens= async((UserId) =>{

   try {
     const user= await User.findById(UserId)
 
     const accessToken=user.generateAccessToken();
     const refreshToken=user.generateRefreshToken();
     if(!accessToken)
         throw new ApiError(400,"unauthorized generation")
 
     // now storing the refresh token in database as we have the object user of database so adding one more field to object
 
     user.refreshToken=refreshToken;

     // now save it in database

     await user.save({ ValidateBeforeSave: false})
 
     // return the accesstoken and refresh token objects
 
     return {accessToken,refreshToken};
 
 
   } catch (error) {
         console.log(error)
         throw new ApiError(400,"something went wrong during generation of tokens")
    
   }



})



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


// this function is for login.

const logInUser= asyncHandler(async(req,res)=>{

    // steps for log in 
    //1. req ->data
    //2. username or email -> atleast one is required
    //3. find the user
    //4. password check (verify it)
    //5. generate access token and refresh token
    //6. send tokens as cookies
    //7. send the response

    const {username,email,password}=req.body

    if(!username && !email)
        throw new ApiError(404," atleast proveide one thing for login either email or username")

    const user = await  User.findOne({
           $or: [{ username },{ email }]
    })

    // verifying the password

    const isPasswordValid= await  user.isPasswordCorrect(password)

    if(!isPasswordValid)
        throw ApiError(401,"unauthorized access -> wrong password")

    // for generating token we will make a separate function. and pass user._id from here.

    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);

    // now sending tokens as cookies

    const options ={
        httpOnly:true,
        secure:true
    }

    // again going to database as previous user as no accesstoken and refreshtoken , it is a costly task.
    // and also avoid to send password and refresh token

    const loggedInUser= await User.findById(user._id).select("-password -refreshToken");

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new Apiresponse(

            200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            "user is logged in successfully"

        )

        
    )

})

// now for log out the user.

const logOutUser=asyncHandler(async(req,res)=>{
   // 1. end the token and delete refresh token from database
   //2. clear the cookies of both access and refresh token.


    // go to database and delete or refresh the refresh token to empty .

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new:true // it makes clear that now if you access the user it have no refresh token .

        }

    )


    const options={
        httpOnly:true,
        secure:true,
    }

    return res
    .status(200)
    .ClearCookie("accessToken",options)
    .ClearCookie("refreshToken",options)
    .json(new Apiresponse(200, {}, "User logged out"))
})

// now controller for refreshing the access token so that we dont need to enter password again and again. this concept of two tokens is first pinned by google

const refreshAccessToken= asyncHandler(async(req,res) =>{

    // first access the present refresh token from cookies

    const incomingRefreshToken= req.cookies?.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken)
        throw new ApiError(400, " Unauthorized request")

    // now verifyinf the incoming refresh token

    try {
        const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        // now accessing the refresh token which is present in database as refresh token has a field _id so access it with the help
        // of that (through incomingRefreshToken)
    
        const user= await User.findById(decodedToken?._id)
    
        if(!user)
            throw new ApiError(400,"Invalid refresh Token")
        
    
        if(!refreshToken)
            throw new ApiError(400, " refreshToken has been expired  , session expired")
    
        // now matching or checking if the incoming refresh token and the stored refresh token in database is same or not 
    
        if(incomingRefreshToken != user?.refreshToken)
            throw new ApiError(400, " session expired")
    
        // now all checking is done  generate new access token and refresh token
    
        const {accessToken,newRefreshToken} =  await generateAccessAndRefreshTokens(user._id);
    
    
        const options ={
            httpOnly:true,
            secure:true,
        }
    
        res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new Apiresponse(
                200,
                {
                    accessToken, refreshToken: newRefreshToken
                },
                " Access token refreshed "
            )
    
        )
    } catch (error) {
        throw new ApiError(400,error?.message || "invalid refresh token")
        
    }
})










export {
    registerUser,
    logInUser,
    logOutUser,
    refreshAccessToken,



}
