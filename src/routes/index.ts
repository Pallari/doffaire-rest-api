import { Application } from "express";
import groomerRouter from "./groomer/Groomer";
export default class Routes {
  constructor(app: Application) {
    // course reoutes
    console.log(`--index.ts file-----`);
    app.use("/groomer", groomerRouter);
    // // lesson routes
    // app.use('/api/lessons', lessonRouter);
  }
}
