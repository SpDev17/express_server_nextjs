import to from 'await-to-js';
import { IUser } from '../../databases/mongodb/model/user.model';
import UserModel from '../../databases/mongodb/schema/user.schema';
import { ErrorMessages } from '../../shared/enums/messages/error-messages.enum';
import { userDTO } from '../../databases/mongodb/DTO/userDTO';
import { ConflictException, InternalServerErrorException, NotFoundException } from '../../shared/exceptions/http.exceptions';
import { IMongooseError } from '../../shared/models/extensions/errors.extension';
import {
    MongooseErrorCodes,
    MongooseErrors,
} from '../../shared/enums/db/mongodb-errors.enum';

// POST /api/mongoose/users
export const createNewUser = async (userData: IUser) => {
    const newUser = new UserModel();
    newUser.first_name = userData.first_name;
    newUser.email = userData.email;
    newUser.password = userData.password;

    const [error] = await to(newUser.save());

    if (error && MongooseErrors.MongoServerError) {
        const mongooseError = error as IMongooseError;
        // check if there is a duplicate entry
        if (mongooseError.code === MongooseErrorCodes.UniqueConstraintFail) {
            throw new ConflictException(ErrorMessages.DuplicateEntryFail);
        } else {
            throw new InternalServerErrorException(ErrorMessages.CreateFail);
        }
    }
    const userDTO1 = userDTO.toResponse(newUser);
    return userDTO1;
};

// GET /api/mongoose/users
export const retrieveUsers = async (): Promise<userDTO[]> => {
    const [error, users] = await to(UserModel.find({}));

    // if get fails for whatever reason
    if (error) {
        throw new InternalServerErrorException(ErrorMessages.GetFail);
    }
    // map a list of Mongoose users to userDTO
    const usersDTO1 = users.map((user) => userDTO.toResponse(user));
    return usersDTO1;
};

// GET /api/mongoose/users/:id
export const retrieveUserById = async (id: string): Promise<userDTO> => {
    const [error, existingUser] = await to(UserModel.findById(id));
    if (!existingUser) {
        throw new NotFoundException(`User with id: ${id} was not found!`);
    }
    if (error) {
        throw new InternalServerErrorException(ErrorMessages.GetFail);
    }
    const userDTO1 = userDTO.toResponse(existingUser);
    return userDTO1;
};

// PATCH /api/mongoose/users/:id
export const updateUser = async (
    id: string,
    userData: Partial<IUser>
): Promise<userDTO> => {
    const [error, updatedUser] = await to(UserModel.findOneAndUpdate(
        { _id: id },
        { $set: { ...userData } },
        { new: true }
    ));

    if (!updatedUser) {
        throw new NotFoundException(`User with id: ${id} was not found!`);
    }

    if (error) {
        throw new InternalServerErrorException(ErrorMessages.UpdateFail);
    }

    const userDTO1 = userDTO.toResponse(updatedUser);
    return userDTO1;
};

export const updateUserPassword = async (
    id: string,
    newPassword: string
): Promise<userDTO> => {
    const [error, updatedUser] = await to(UserModel.findOneAndUpdate(
        { _id: id },
        { $set: { password: newPassword } },
        { new: true }
    ));

    if (!updatedUser) {
        throw new NotFoundException(`User with id: ${id} was not found!`);
    }

    if (error) {
        throw new InternalServerErrorException(ErrorMessages.UpdateFail);
    }

    const userDTO1 = userDTO.toResponse(updatedUser);
    return userDTO1;
};

export const deleteUser = async (id: string): Promise<void> => {
    const [error, existingUser] = await to(UserModel.findById(id));

    if (!existingUser) {
        throw new NotFoundException(`User with id: ${id} was not found!`);
    }

    if (error) {
        throw new InternalServerErrorException(ErrorMessages.DeleteFail);
    }

    await UserModel.findOneAndDelete({ _id: id });
};