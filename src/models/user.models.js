import mongoose,{Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema= Schema({

    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true,  // we use index for searching field as it is very costly so use it carefully.

    },
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
        type :String, // from cloudinary
        required:true,

    },
    coverImage:{
        type:String,  // from cloudinary
    },

    watchHistory:[
        {
        type:Schema.Types.ObjectId,
        ref:"videos",
      }],
      password:{
        type:String,
        required:[true,`password is required`],
      },
      refreshToken:{
        type:String,
      }
},{timestamps:true})



// two impoertant points from  this is password and refresh token .we have to take care of password.

// here we are encrpting the password because we do not want to store the password as clear text in database hence we encrypt it and 
// then store it in database we only do it when we want to change the password or set it to new password hence there is a 
// condition . 
// keep in mind in new version of mongoose we done need to return next

userSchema.pre("save",async function (next) {
    if(!this.isModified("password"))  return 

        this.password= await bcrypt.hash(this.password,10)
        
})
// to check if the entered password is correct or not
// this is syntax of making custom methods in userSchema. here methods is the object of userSchema
userSchema.methods.isPasswordCorrect = async  function (password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function (){
    jwt.sign(
        {
        _id: this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
        },
      process.env.ACESS_TOKEN_SECRET,
      {
        expiresIN:process.env.ACCESS_TOKEN_EXPIRY
      }  
    )
}

userSchema.methods.generateRefreshToken = function (){ // refresh token contains less payload(data)
    jwt.sign(
        {
        _id: this._id,
        
        },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIN:process.env.REFRESH_TOKEN_SECRET
      }  
    )
}

const User = mongoose.model("User",userSchema)

export {User}