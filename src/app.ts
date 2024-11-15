import cors from "cors";
import express, { Application, Request, Response } from "express";
import notFound from "./app/middleware/notFound";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import router from "./app/routes";
const app: Application = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://explore-nest-client.vercel.app"],
    credentials: true,
  })
);

// module routes
app.use("/api", router);

// test routes
app.get("/", (req: Request, res: Response) => {
  const a = "Hello this is Explore nest server";

  res.send(a);
});

// global error handler middleware
app.use(globalErrorHandler);

// not found route middleware
app.use(notFound);

export default app;
