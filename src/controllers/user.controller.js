import { asyncHandler } from "../utils/asyncHandler.js";


// a controller for registering
const registerUser= asyncHandler(async(req,res) =>{
    const {fullname,email,username,password}=req.body
      console.log("email :",email);
   
})


// now for  just checking input taking from frontend(postman)




export {
    registerUser
}
