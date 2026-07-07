import { v2 as cloudinary } from "cloudinary"
import fs from "fs"  // fs is here file system.






    // Configuration
    // cloudinary.config({ 
    //     cloud_name: process.env.CLOUD_NAME,
    //     api_key: process.env.API_KEY, 
    //     api_secret: process.env.API_SECRET, // Click 'View API Keys' above to copy your API secret
    // });


    // NOW CODE FOR TAKING THE LOCAL IMAGE PATH FROM SERVER AND LOAD IT TO CLOUDINARY AND GENERATE ITS URL .

    const uploadoncloudinary= async(localfilepath) =>{


        cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET, // Click 'View API Keys' above to copy your API secret
    });


        try{
            if(!localfilepath)  return null
            // upload the file on cloudinary
           const response = await cloudinary.uploader.upload(localfilepath ,{
                resource_type:"auto"
            })
            // file has been uploaded
            console.log("file is uploaded on cloudinary",response.url);
             fs.unlinkSync(localfilepath);
            return response
        }
        catch(error)
        {
            console.log("cloudinary upload failed", error)

            if (fs.existsSync(localfilepath)) {
            fs.unlinkSync(localfilepath);
            // remove the locally saved temporary file as the upload operation got failed .
            return null;
             }
        }

    }
    
    export {uploadoncloudinary}
    