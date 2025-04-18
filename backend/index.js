import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { env } from "./env.js";
import { connectDB } from "./database/db.connect.js";
import studentRoutes from "./routes/Student.routes.js";
import institutionRoutes from "./routes/Institution.routes.js";
import { ApiResponse, sendApiResponse } from "./middlewares/apiResponse.middleware.js";
import feedRoutes from "./routes/feed.routes.js";
import baseRoutes from "./routes/Base.routes.js";
import institutionAuthorRoutes from "./routes/InstitutionAuthor.routes.js";
import publisherRoutes from "./routes/Publisher.routes.js";



const app = express();
const apiVersion = "/api/v1";

// Connect to the database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors());
app.use(sendApiResponse)

app.get("/", (req, res) => {
  return res.send(
    new ApiResponse(
      {
        status: 'success',
        message: 'Welcome to KampBuzz API',
      },
      200
    )
  )
});

// Student routes
app.use(`${apiVersion}/student`, studentRoutes);

// Institution routes
app.use(`${apiVersion}/institution`, institutionRoutes);

// Institution Author routes
app.use(`${apiVersion}/author`, institutionAuthorRoutes);

// feed routes
app.use(`${apiVersion}/feed`, feedRoutes);

// Base routes
app.use(`${apiVersion}`, baseRoutes);

// Publisher routes
app.use(`${apiVersion}/publisher`, publisherRoutes);


app.listen(env.PORT, () => {
  console.log(`Server is running on port http://127.0.0.1:${env.PORT}`);
});

