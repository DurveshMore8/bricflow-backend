import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import requestLogger from "./common/logger/requestLogger";
import errorMiddleware from "./common/middleware/error.middleware";
import v1Routes from "./routes/v1.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(requestLogger);
app.use(errorMiddleware);

app.use("/api/v1", v1Routes);

export default app;
