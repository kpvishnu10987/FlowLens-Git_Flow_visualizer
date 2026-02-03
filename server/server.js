import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import commitRoutes from "./routes/commits.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use('/api/commits',commitRoutes);


app.get('/',(req,res)=>{
    res.send("server is running");
})

app.listen(PORT,()=>{
    console.log(`app is running on PORT : ${PORT}`)
})