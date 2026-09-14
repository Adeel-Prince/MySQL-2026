import express from "express";
// import dotenv from "dotenv";
// dotenv.config();

// import { env } from "../Project URL Shortener with Express/config/env.js";
import {shortenerRoutes} from "./routes/shortener.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import {verifyAuthentication} from "./middlewares/verify-auth-middleware.js";
import requestIp from "request-ip";
import session from "express-session";
import flash  from "connect-flash";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads', 'avatar');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = 3000;

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/avatar/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.set("view engine" , "ejs");


app.use(cookieParser());
// Express Routers...

app.use(
    session({secret: "my-secret", resave: true, saveUninitialized: false})
);
app.use(flash());

app.use(requestIp.mw());

app.use(verifyAuthentication);

app.use((req, res, next) =>{
    res.locals.user = req.user;
    return next();
})

// app.use(router);
app.use(authRoutes);
app.use(shortenerRoutes);

app.use((req, res) => {
    res.status(404).send("Page not found");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`); 
})

export { upload };