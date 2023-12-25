import dotenv from "dotenv";
import express from "express";
import db from "./db/dbconnect.js";

dotenv.config({path:"./env"});

db();


