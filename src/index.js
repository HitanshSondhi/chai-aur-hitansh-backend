import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: './.env' // Correct path to your .env file
});

connectDB()
 .then(()=>{
    app.on("error",()=>{
        console.log("Error :",error);
        throw error
       })
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
 })   
 .catch((err)=>{
    console.log("Mongodb connection failed",err);
 })

/*import express from "express";
const app=express()
;(async()=>{
    try {
       await mongoose.connect('${process.env.MONGODB_URL}/${DB_NAME}')
       app.on("error",()=>{
        console.log("Error :",error);
        throw error
       })
       app.listen(process.env.PORT,()=>{
        console.log('App is listening on Port ${process.env.PORT}')
       })
    } catch (error) {
        console.log("Error",error);
        throw error;
        
    }

})()*/




