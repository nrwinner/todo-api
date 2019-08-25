import * as express from 'express';
import { MongoDriver } from './mongo/MongoDriver';
import { TaskModule } from './TaskModule/TaskModule';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';

// configure dotenv
dotenv.config();

// create express app
const app = express();

// use body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// retrieve new express Router
const router = express.Router();

// create instance of DataStore
const dataStore = new MongoDriver();

// init modules
TaskModule.init(router, dataStore);

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