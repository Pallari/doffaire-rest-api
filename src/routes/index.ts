import { Application } from "express";
import groomerRouter from "./Groomer";
import authRouter from "./Auth";
import veteranRouter from './veteran';
export default class Routes {
  constructor(app: Application) {
    // common routes
    app.use("/auth", authRouter);
    // Groomer routes
    app.use("/groomer", groomerRouter);
    // Veteran routes
    app.use("/veteran", veteranRouter);
  }
}
