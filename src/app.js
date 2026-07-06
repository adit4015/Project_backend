import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
 
const app=express();


app.use(cors({
    // to ensure it will only request from our frontend not from any other frontend
    origin:process.env.CORS_ORIGIN,
    Credential:true


}))

// frontend se data kisi bhi form me aa sakta json,url wagerah hence we have to accept them and also make a limit of them .
// limit the jason upto 16 kb 
app.use(express.json({limit: "16kb"}))
// for data coming as url
app.use(express.urlencoded({extended:true , limit: "16kb"}))

// for tranfering data to a fole which has public access.
app.use(express.static("public"))
// for taking cookies from user browser use cookie parser

app.use(cookieParser())


// import router
import userRouter from './routes/user.routes.js' 
 
// now using it , we dont use it as app.get , becuase in app.get we write the route and controller ast same place but now we 
// have separated them into different files of controller and routes hence we will use middleware .


app.use("/api/v1/users",userRouter)  // now it will go to user.routes.js.  this paths always starts from /(keep in mind)

// the url will like this http:localhost//8000/api/v1/users/register
// the register can be login etc according to the routegiven by frontend we will route it from user.route as imported as userRouter



export { app }






