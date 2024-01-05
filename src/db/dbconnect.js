import mongoose from "mongoose";
import {db_name} from "../constants.js";

// const app = express();
// (async() => {
//     try{
//         mongoose.connect(`${process.env.MONGO_URI}/${db_name}`)
//         app.on("error", () => {
//             console.log(`Error connecting to database`)
//         })
//         app.listen(process.env.PORT, () => {
//             console.log("Server is running on port ${process.env.PORT}")
//         })
//     }catch(error){
//         console.log(error)
//     }
// })();


const db=async()=>{
    try{
        const dbconnection=await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`)
        console.log(`Database connected at ${dbconnection.connection.host}`)
    }catch(error){
        console.log("Error connecting to database")
        console.log(error)
    }
};

export default db;