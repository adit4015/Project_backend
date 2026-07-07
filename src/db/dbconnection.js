
import mongoose from "mongoose"

import {DB_NAME} from "../constants.js";
const connectDB=async()=>{
    try{
        // if we dont append db name after mongodb uri then it automatically makes a test data in database.
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`\n MongoDB connected ! ! DB host :${connectionInstance.connection.host}`);

    }
    catch(error){
        console.log(error);

    }
}

export default connectDB



/*This is the number one culprit. In your .env file, your MONGODB_URI might look like this:

Plaintext
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
If you don't explicitly append the database name at the end of the connection URI string or pass your DB_NAME constant correctly inside your connectDB() utility, Mongoose defaults to creating and saving data into a database named test.

When you open MongoDB Compass or Atlas, you might be looking at a clean database named videotube or backend, while your code is secretly reading/writing old records from the hidden test database!

The Fix:
Check your src/db/dbconnection.js file. Make sure you are appending the DB_NAME to the URI string like this:

JavaScript
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error ", error);
        process.exit(1);*/
