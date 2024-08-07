import { Express, Request, Response, Router } from 'express';
import { isAuthenticated } from '../../services/auth/auth.service';
import apiController from '../../controllers/mongoose/base.controllers';
const siteApiRoute: Router = Router();


siteApiRoute.route('/user/me').get(isAuthenticated, apiController.me);
siteApiRoute.route('/user/auth/:mode').post(apiController.login);
siteApiRoute.route('/:model/get_json').get(apiController.getJson);
siteApiRoute.route('/:model/get_json/:id').get(apiController.getJson);


export default siteApiRoute;