import { Express, Request, Response } from 'express';
import mongooseUsersRouter from '../controllers/mongoose/user.controller';
import responseInterceptor from '../shared/middlewares/response-interceptor';
import { pageNotFoundExceptionHandler } from '../shared/middlewares/page-not-found-exception-handler.middleware';
import { exceptionHandler } from '../shared/middlewares/exception-handling.middleware';

import siteApiRoute from './routes/siteApiRoute';
import postGreSqlApiRoute from './routes/siteApiRouteSql';
const routerSetup = (app: Express) =>
  app
    //.use(responseInterceptor)
    .get('/', async (req: Request, res: Response) => {
      res.send('Hello Express APIvantage!');
    })
    .use('/api/mongoose/users', mongooseUsersRouter)
    .use('/_api', siteApiRoute)
    .use('/_api1', postGreSqlApiRoute)
    .use('*', pageNotFoundExceptionHandler)
    .use(exceptionHandler);

export default routerSetup;