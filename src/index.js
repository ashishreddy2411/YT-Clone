import dotenv from "dotenv";
import express from "express";
import db from "./db/dbconnect.js";
import {app} from './app.js'

dotenv.config({path:"./.env"});

db()
.then(()=>{
    try{
        app.listen(process.env.PORT, ()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }catch(error){
        console.log(error);
    }
})
.catch(()=>{
    console.log(error);
});

export {app};