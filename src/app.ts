import express from 'express';
import * as bodyParser from 'body-parser';
import AuthRoutes from './routes/authentication'
import CategoryRoutes from './routes/category'
import OrderItemRoutes from './routes/order_item'
import OrderRoutes from './routes/order'
import ProductRoutes from './routes/product'
import SizeRoutes from './routes/size'
import StripeRoutes from './routes/stripe'

import { error_handler_middleware } from './middleware/error-handler';
import { isProdEnv } from './utils/logger';
import { HttpStatusCode } from './utils/enums';

const cookieParser = require('cookie-parser');
let cors = require('cors');

var allowCrossDomain = function (req: any, res: any, next: any) {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

class App {
  public httpServer: any;

  constructor() {

    this.httpServer = express();
    this.httpServer.use(bodyParser.urlencoded({ extended: true }));
    this.httpServer.use(bodyParser.json());

    // jwt
    this.httpServer.use(cookieParser('73cc5d1ebb515e092db1e8073e586a152d3d4f3fb3048e84918db434391dfaded63008e2d14f79b469d0ec11f9c333069176339d74468afc6063a635a79da6fb'));
    this.httpServer.use(allowCrossDomain);

    if (isProdEnv()) {
      this.httpServer.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], credentials: true }));
    }
    else {
      this.httpServer.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], credentials: true }));
    }

    this.httpServer.get("/", function (req: any, res: any) {
      res.send("hello world");
    });

    this.ping();
    this.httpServer.use('/api/auth', AuthRoutes);
    this.httpServer.use('/api/order-item', OrderItemRoutes);
    this.httpServer.use('/api/category', CategoryRoutes);
    this.httpServer.use('/api/order', OrderRoutes);
    this.httpServer.use('/api/product', ProductRoutes);
    this.httpServer.use('/api/size', SizeRoutes);
    this.httpServer.use('/api/stripe', StripeRoutes);
    this.httpServer.use(error_handler_middleware)
  }

  ping() {
    this.httpServer.get('/ping', (req: express.Request, res: express.Response) => {
      res.json({ status: HttpStatusCode.OK, message: "I am Alive" });
    });
  }

  public Start = (port: number) => {
    return this.httpServer.listen(port);
  }
}

export default App;