import { Application } from "express";
import courseRouter from "./groomer/Groomer";
export default class Routes {
  constructor(app: Application) {
    // course reoutes
    console.log(`--index.ts file-----`);
    app.use("/groomer", courseRouter);
    // // lesson routes
    // app.use('/api/lessons', lessonRouter);
  }
}
