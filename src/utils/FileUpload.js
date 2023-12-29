import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api_Key, 
    api_secret: process.env.Cloud_Api_Secret, 
  });

  const uploadFile=async (filePath)=>{
    try{
        if(!filePath){
            throw new Error("File not found");
            return null;
        }
        const result=await cloudinary.uploader.upload(filePath);
        return result;
    }catch(error){
        console.log("Error while uploading file to cloud",error);
        throw error;
    }finally{
        fs.unlinkSync(filePath);
    }
  };

    export {uploadFile};