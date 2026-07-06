import mongoose from "mongoose"

const userSchema= Schema({

    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true,  // we use index for searching field as it is very costly so use it carefully.

    },
    fullname:{
        type:String,
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

userSchema.pre("save",async function (next) {
    if(this.isModified("password")){
        this.password= bcrypt.hash(this.password,10)
        next()
    }

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
      process.env.ACESS-TOKEN-SECRET,
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
      process.env.REFRESH-TOKEN-SECRET,
      {
        expiresIN:process.env.refreshToken_TOKEN_EXPIRY
      }  
    )
}

const User = mongoose.model("User",userSchema)