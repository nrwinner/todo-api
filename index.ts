import * as express from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

// Modules
import { TaskModule } from './TaskModule/TaskModule';
import { UserModule } from './UserModule/UserModule';
import { AuthModule } from './AuthModule/AuthModule';
import { decodeToken } from './helpers/TokenManager';

// configure dotenv
dotenv.config();

// create express app
const app = express();

// use body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure cors
app.use(cors({ origin: '*' }));

// configure authentication middleware
app.use((req, _, next) => {
  const authorHeaders = req.headers.authorization || undefined;
  
  if (authorHeaders) {
    const [type, token] = [authorHeaders.split(' ')[0], authorHeaders.split(' ').slice(1).join('')]

    if (type === 'Bearer') {
      req['user'] = decodeToken(token);
    }
  }

  next();
});

// retrieve new express Router
const router = express.Router();

// init modules
new AuthModule(router);
new TaskModule(router);
new UserModule(router);

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