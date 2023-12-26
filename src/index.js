import dotenv from "dotenv";
import express from "express";
import db from "./db/dbconnect.js";

dotenv.config({path:"./env"});
const app = express();

db()
.then(()=>{
    try{
        app.listen(process.env.PORT || 7000, ()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }catch(error){
        console.log(error);
    }
})
.catch(()=>{
    console.log(error);
});
