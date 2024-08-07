import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import passport from 'passport';
import { signToken } from '../../services/auth/auth.service';

const apiController = () => {
    var GetModelObject = function (param: string) {
        var obj = null;
        if (param === "permission") {
            obj = require('../../databases/mongodb/schema/permission.schema');
        } else if (param === "grouppermission") {
            obj = require('../../databases/mongodb/schema/grouppermission.schema');
        }
        else if (param === "group") {
            obj = require('../../databases/mongodb/schema/group.schema');
        }
        else if (param === "user") {
            obj = require('../../databases/mongodb/schema/user.schema');
        }
        else if (param === "restaurants") {
            obj = require('../../databases/mongodb/schema/restaurants.schema');
        }
        //
        return obj;
    };
    var GetResponseDTO = function (param: string) {
        var obj: any = null;
        if (param === "permission") {
            obj = require('../../databases/mongodb/DTO/permissionDTO');
            obj = obj['permissionDTO'];
        } else if (param === "grouppermission") {
            obj = require('../../databases/mongodb/DTO/groupPermissionDTO');
            obj = obj['groupPermissionDTO'];
        }
        else if (param === "group") {
            obj = require('../../databases/mongodb/DTO/groupDTO');
            obj = obj['groupDTO'];
        }
        else if (param === "user") {
            obj = require('../../databases/mongodb/DTO/userDTO');
            obj = obj['userDTO'];
        }
        else if (param === "restaurants") {
            obj = require('../../databases/mongodb/DTO/restaurantDTO');
            obj = obj['restaurantDTO'];
        }
        return obj;
    };
    const login = (req: Request, res: Response, next: NextFunction) => {
        const mode = req.params.mode;
        var User: any = GetModelObject("user");
        if (mode == "local") {
            var localPassport = require("../../services/auth/local/passport_local").setup(User);
            passport.authenticate("local", function (err: any, user: any, info: any) {
                var error = err || info;
                if (error) {
                    return res
                        .status(401)
                        .json(error)
                        .end();
                }
                if (!user) {
                    console.log('user not found');
                    return res.status(404).json({
                        message: "Something went wrong, please try again."
                    });
                }
                if (user) {
                    console.log('user found');
                    let objDTO = require('../../databases/mongodb/DTO/userDTO');
                    objDTO = objDTO['userDTO'];
                    objDTO = objDTO?.toResponse(user);
                    //var token = signToken(user._id, objDTO.groups);
                    var token = signToken(objDTO);
                    res.json({
                        token: token,
                        data: objDTO
                        //data: {}
                    });
                }
            })(req, res, next);
        }
        //res.send({ 'status': '200d' });
    }
    const me = (req: any, res: any, next: any) => {
        const mode = req.params.mode;
        const model = req.params.model;
        res.send(req.user);
    }
    const getJson = asyncHandler(async (req: Request, res: Response) => {
        //http://localhost:1001/_api/user/get_json?desc=false&limit=10&lookup=%5B%7B%22model%22%3A%22group%22%2C%22select%22%3A%22title%22%2C%22path%22%3A%22groups%22%7D%5D&page=1&search=%22%22&select=%5B%22first_name%22%2C%22last_name%22%2C%22email%22%2C%22mobile%22%2C%22isactive%22%5D&sort=%22email%22
        const model = req.params.model;
        const objModel = GetModelObject(model);
        const objDTO = GetResponseDTO(model);
        let id: string = req.params.id;
        let objData: any = {};
        let selectJson: any = parseQueryString(req.query.select, {});
        let lookup: any = parseQueryString(req.query.lookup, {});
        if (id != null && id != undefined) {
            objData['id'] = id;
            objData['select'] = selectJson;
            objData['lookup'] = lookup;
            objModel.default.fn_ReadById(objData).then(function (item: any) {
                const usersDTO = objDTO?.toResponse(item);
                res.send(usersDTO);
            }, function (err: any) {
                res.status(422).json(err);
            });
        } else {

            let perPage: Number = parseQueryString(req.query.limit, 10);
            let page: Number = parseQueryString(req.query.page, 1);

            let sortParam: string = parseQueryString(req.query.sort, "title");
            let sortOrder: any = parseQueryString(req.query.desc, false);
            sortOrder = sortOrder == true ? -1 : 1;
            let sortJson: any = {};
            sortJson[sortParam] = sortOrder;
            let searchParam: string = parseQueryString(req.query.search, "");
            let searchkeypassed: boolean = parseQueryString(req.query.searchkeypassed, false);
            var searchJson: any = {};
            if (
                searchParam != undefined &&
                searchParam != "" &&
                searchParam != '""'
            ) {
                if (searchkeypassed) {
                    searchJson = Object.assign({}, searchParam);
                } else {
                    searchJson[sortParam] = {
                        $regex: searchParam,
                        $options: "i"
                    };
                }
            } else {
                searchJson = {};
            }


            var lookupArray = [];
            if (model == 'user') {
                lookupArray.push({
                    path: "groups",
                    model: "group",
                    select: "title",
                    populate: {
                        path: "grouppermission",
                        model: "permission",
                        select: "title"
                    }
                });
            }
            objData['select'] = selectJson;
            objData['search'] = searchJson;
            objData['sort'] = sortJson;
            objData['limit'] = perPage;
            objData['page'] = page;
            objData['lookup'] = lookupArray;//lookup;

            objModel.default.fn_Read(objData).then(function (items: any) {
                const usersDTO = items.map((item: any) => objDTO?.toResponse(item));
                console.log(usersDTO);
                res.send(usersDTO);
            }, function (err: any) {
                res.status(422).json(err);
            });
        }
    });       
    const update = asyncHandler(async (req: Request, res: Response) => {
        const model = req.params.model;
    });
    const destroy = asyncHandler(async (req: Request, res: Response) => {
        const model = req.params.model;
    });
    const deletes = asyncHandler(async (req: Request, res: Response) => {
        const model = req.params.model;
    });
    const create = asyncHandler(async (req: Request, res: Response) => {
        const model = req.params.model;
    });
    const creates = asyncHandler(async (req: Request, res: Response) => {
        const model = req.params.model;
    });
    var parseQueryString = function (param: any, defaultValue: any) {
        if (
            param != "" &&
            param != "undefined" &&
            param != null &&
            param.length > 0
        ) {
            return JSON.parse(param);
        } else {
            return defaultValue;
        }
    };
    return {
        login,
        me,
        getJson,
        update,
        destroy,
        deletes,
        create,
        creates
    };
}
export default apiController();