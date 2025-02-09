import { Application } from 'express';
import groomerRouter from './Groomer';
import authRouter from './Auth';
import veteranRouter from './veteran';
import bookingRouter from './Booking';
import dashboardRouter from './Dashboard';
import reviewRouter from './Review';
export default class Routes {
  constructor(app: Application) {
    // Default Route
    app.get('/', function(req, res){
      res.send('Doffair App is running');
    });

    // common routes
    app.use('/auth', authRouter);
    // Groomer routes
    app.use('/groomer', groomerRouter);
    // Veteran routes
    app.use('/veteran', veteranRouter);
    // Booking routes
    app.use('/booking', bookingRouter);
    // Dashboard routes
    app.use('/dashboard', dashboardRouter);
     // revier routes
     app.use('/review', reviewRouter);

  }
}
