import * as express from 'express';
import { TaskMongoDriver } from './TaskModule/TaskMongoDriver';
import { TaskModule } from './TaskModule/TaskModule';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

// configure dotenv
dotenv.config();

// create express app
const app = express();

// use body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure cors
app.use(cors({ origin: '*' }))

// retrieve new express Router
const router = express.Router();

// init modules
TaskModule.init(router);

// use our complete router
app.use(router);

// set a catch all for returning 404's
app.all('*', async (_, res) => {
  res.sendStatus(404);
})

// set app to listen on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('TODO API listening on port 3000')
})