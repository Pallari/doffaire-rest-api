import { Application } from "express";
import groomerRouter from "./groomer/Groomer";
export default class Routes {
  constructor(app: Application) {
    // Groomer routes
    app.use("/groomer", groomerRouter);
  }
}
