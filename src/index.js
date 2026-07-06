import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})

import {DB_NAME} from "./constants.js"
import connectDB from "./db/dbconnection.js"
import { app } from "./app.js"













connectDB()
// after connecting database we will use a promise to give a message and listen on server.



.then(() => {

    // listeing
    app.listen(process.env.PORT || 8000 ,() =>{
        console.log(`server is connected at port ${process.env.PORT}`)

    })
})
.catch((err) =>{
    console.log("mongodb connection failed ! ! !", err)

}) 















// first approach
/*import express from "express"
const app=express()

// using effi

(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        // listeners
        application.on("error",(error)=>{
            console.log("error:",error);
            throw error
        })
        app.listen(process.env.PORT,() =>{
            console.log(`app is listening on port ${ process.env.PORT}`);
        })

    }
    catch(error){
        console.error("Error:",error)
        throw error

    }
})()*/