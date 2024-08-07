import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { IUser } from '../../databases/mongodb/model/user.model';
import UserModel from '../../databases/mongodb/schema/user.schema';
import * as userService from '../../services/user/user.service';
import { createUserValidator, updateUserValidator, getUserByIdValidator, changePasswordValidator } from '../../shared/middlewares/user-validator.middleware';
//import IHTTPError from '../../shared/models/http-error';
import { SuccessMessages } from '../../shared/enums/messages/success-messages.enum';
const controller = Router();

controller

    .post('/', createUserValidator, asyncHandler(async (req: Request, res: Response) => {
        const newUser = await userService.createNewUser(req.body);
        res.status(201).send(newUser);
    }))

    .get('/', asyncHandler(async (req: Request, res: Response) => {
        const users = await userService.retrieveUsers();
        res.send(users);
    }))

    .get('/:id', getUserByIdValidator, asyncHandler(async (req: Request, res: Response) => {
        const existingUser = await userService.retrieveUserById(req.params.id);
        res.send(existingUser);
    }))

    .patch(
        '/:id',
        getUserByIdValidator,
        updateUserValidator,
        asyncHandler(async (req: Request, res: Response) => {
            const updatedUser = await userService.updateUser(req.params.id, req.body);
            res.send(updatedUser);
        })
    )
    .patch(
        '/change-password/:id',
        getUserByIdValidator,
        changePasswordValidator,
        asyncHandler(async (req: Request, res: Response) => {
            const updatedUser = await userService.updateUserPassword(
                req.params.id,
                req.body.new_password
            );
            res.send(updatedUser);
        })
    )

    .delete('/:id', getUserByIdValidator, asyncHandler(async (req: Request, res: Response) => {
        await userService.deleteUser(req.params.id);
        res.send({ message: SuccessMessages.UserRemoveSuccess });
    }));

export default controller;