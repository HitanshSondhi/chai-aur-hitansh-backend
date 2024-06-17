import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import userRouter from "./routes/user.routes.js";

// import userRouter from "./routes/user.routes.js";

const app=express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true

})

)

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true ,limit:"20kb"}))
app.use(express.static("public "))
app.use(cookieParser())

export {app}

//routes import


