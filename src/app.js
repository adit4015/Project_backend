import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
 
const app=express()


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




