const express = require('express');
import { Request, Response } from "express";
const app = express();
const PORT = 3001

app.use(express.json());

app.get("/",(req: Request, res: Response)=>{
    res.send("Hello World")
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
