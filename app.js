import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import publicRoute from "./routes/publicRoute.js";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import path from "path";
const app = express();
dotenv.config();

connectDB();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/ecommerce",
      collectionName: "sessions",
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
    },
  })
);

app.use("/", publicRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);

export default app;
