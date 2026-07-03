
import mongoose from "mongoose"

import {DB_NAME} from "../constants.js";
const connectDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect("mongodb+srv://aditya_pro:adit_4015@youtubedata.vcvkxi0.mongodb.net/?appName=youtubedata")

        console.log(`\n MongoDB connected ! ! DB host :${connectionInstance.connection.host}`);

    }
    catch(error){
        console.log(error);

    }
}

export default connectDB