import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connect from "./db/connect";      
import routes from "./routes";
import config from "config";

const port = config.get("port") as number;
const app = express();


app.use(cors());
app.use(express.json());
routes(app);


app.listen(port, async () => {
    console.log(`running on localhost:${port}`)
    await connect();
})


