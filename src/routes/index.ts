import { Application } from "express";
import groomerRouter from "./Groomer";
import authRouter from "./Auth";
export default class Routes {
  constructor(app: Application) {
    // course reroutes
    app.use("/groomer", groomerRouter);
    app.use("/auth", authRouter);
  }
}
