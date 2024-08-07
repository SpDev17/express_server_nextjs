import cors from "cors";
import { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
const securitySetup = (app: Express, express: any) =>
  app
    .use(helmet())//20240804
    .use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))//20240804
    .use(morgan("common"))//20240804
    .use(cors())
    
    .use(
      express.urlencoded({
        extended: true,
      })
    )
    .use(express.json({ limit: "50mb" }));

export default securitySetup;
