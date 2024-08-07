import { Express, Request, Response, Router } from 'express';
//import { isAuthenticated } from '../../services/auth/auth.service';
import apiController from '../../controllers/typeorm/base.controllers';
const postGreSqlApiRoute: Router = Router();


//siteApiRoute.route('/user/me').get(isAuthenticated, apiController.me);
//siteApiRoute.route('/user/auth/:mode').post(apiController.login);
postGreSqlApiRoute.route('/:model/get_json').get(apiController.getJson);
postGreSqlApiRoute.route('/:model/get_json/:id').get(apiController.getJson);

postGreSqlApiRoute.route('/dashboard').get(apiController.getDashboardMatrix);
postGreSqlApiRoute.route('/expenses').get(apiController.getExpensesByCategory);
postGreSqlApiRoute.route('/products').get(apiController.getProducts);
postGreSqlApiRoute.route('/createProduct').post(apiController.createProduct);
postGreSqlApiRoute.route('/users').get(apiController.getUsers);


export default postGreSqlApiRoute;