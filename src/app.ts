import express, { Application, Request, Response } from "express";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorhandelers";
import notFound from "./app/middlewares/notFoundRoute";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
const app: Application = express();

app.use(express.static(path.join(__dirname, "../public")));

// const app = express();

// Add CORS middleware
app.use(
  cors({
    origin: [
      "https://turbo-shine-client-frontend.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
    // Allow cookies, authorization headers with the same origin, and credentials
  })
);

// Add body-parser middleware to handle JSON request bodies
app.use(express.json()); // This will parse incoming JSON requests
app.use(cookieParser());

// Add EJS view engine
app.set("view engine", "ejs");


app.get("/", (req: Request, res: Response) => {
  res.send("Hello!, This is Explore Nest server.");
});

// application routes
app.use("/api", router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
