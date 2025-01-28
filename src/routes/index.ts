import { Application } from 'express';
import groomerRouter from './Groomer';
import authRouter from './Auth';
import veteranRouter from './veteran';
import bookingRouter from './Booking';
import dashboardRouter from './Dashboard';
export default class Routes {
  constructor(app: Application) {
    // Default Route
    app.get('/', function(req, res){
      res.send('Doffair App is running');
    });
    app.use('/dashboard', dashboardRouter);

    // common routes
    app.use('/auth', authRouter);
    // Groomer routes
    app.use('/groomer', groomerRouter);
    // Veteran routes
    app.use('/veteran', veteranRouter);
    // Booking routes
    app.use('/booking', bookingRouter);
    // Dashboard routes

  }
}
