import "dotenv/config";
import express from "express"
import cookieParser from "cookie-parser"
import helmet from "helmet";
import cors from "cors";
import { allRoutes } from "./src/module/routes/index.js";
import fileUpload from "express-fileupload";
import { mongoConnection } from "./src/config/mongoDbConfig.js";

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: "https://your-frontend.vercel.app",
  credentials: true
}));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/upload", express.static("upload"));

(
  async () => {
    await mongoConnection();
  }
)();

// all module routes
app.use("/", allRoutes);

const port = process.env.PORT;
// server listening on port 4500
app.listen(port, ()=>{
  console.log(`server listening on ${port}`);  
})

export default app;
