import express from "express";
// import dotenv from "dotenv";
// dotenv.config();

// import { env } from "../Project URL Shortener with Express/config/env.js";

import {shortenerRoutes} from "./routes/shortener.routes.js";

const app = express();
const PORT = 3002;



app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.set("view engine" , "ejs");

// Express Routers...

// app.use(router);
app.use(shortenerRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`); 
})