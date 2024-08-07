import mongoose, { Schema, Document, Model, Query } from "mongoose";
import to from 'await-to-js';
import bCrypt from 'bcrypt-nodejs';

import { ConflictException, InternalServerErrorException, NotFoundException } from '../../../shared/exceptions/http.exceptions';
import { IMongooseError } from '../../../shared/models/extensions/errors.extension';
import { MongooseErrorCodes, MongooseErrors, } from '../../../shared/enums/db/mongodb-errors.enum';
import { ErrorMessages } from '../../../shared/enums/messages/error-messages.enum';
interface BModel {
    b_Read: (objModel: Model<any>, objData: any) => Promise<any>;
    b_ReadById: (objModel: Model<any>, objData: any) => Promise<any>;
    b_Read_One: (objModel: Model<any>, objData: any) => Promise<any>;
    b_GetCount: (objModel: Model<any>, searchJson: any) => Promise<number>;
    b_DeleteById: (objModel: Model<any>, objData: any) => Promise<any>;
    b_DeleteByIds: (objModel: Model<any>, objData: any) => Promise<any>;
    b_Update: (objModel: Model<any>, objData: any) => Promise<any>;
    b_ValidateUser: (objModel: Model<any>, objData: any, done: Function) => Promise<any>;
    b_Create: (objModel: Model<any>, objData: any) => Promise<any>;
    b_Creates: (objModel: Model<any>, objData: any) => Promise<any>;
}

const bModel: BModel = {
    b_Read,
    b_ReadById,
    b_Read_One,
    b_GetCount,
    b_DeleteById,
    b_DeleteByIds,
    b_Update,
    b_ValidateUser,
    b_Create,
    b_Creates
};

export default bModel;

async function b_Read(objModel: any, objData: any): Promise<any> {
    let objDbReq: any = objModel.find(objData.search)
        .sort(objData.sort)
        .select(objData.select)
        .skip(objData.limit * objData.page - objData.limit)
        .limit(objData.limit);
    objDbReq = CreatePopulateExpression(objDbReq, objData.lookup);
    const [error, data] = await to(objDbReq.exec());
    if (error) {
        throw new InternalServerErrorException(ErrorMessages.GetFail + ', ' + error.message);
    }
    return data as any;
}

async function b_ReadById(objModel: Model<any>, objData: any): Promise<any> {
    let objDbReq: any = objModel.findOne({
        _id: objData.id
    }).select(objData.select);
    objDbReq = CreatePopulateExpression(objDbReq, objData.lookup);
    const [error, data] = await to(objDbReq.exec());
    if (error) {
        throw new InternalServerErrorException(ErrorMessages.GetFail + ', ' + error.message);
    }
    return data as any;
}

async function b_Read_One(objModel: Model<any>, objData: any): Promise<any> {
    let objDbReq: any = objModel.findOne(objData.search)
        .select(objData.select)
    objDbReq = CreatePopulateExpression(objDbReq, objData.lookup);
    const [error, data] = await to(objDbReq.exec());
    if (error) {
        throw new InternalServerErrorException(ErrorMessages.GetFail + ', ' + error.message);
    }
    return data as any;
}

async function b_GetCount(objModel: Model<any>, searchJson: any): Promise<any> {
    const [error, data] = await to(objModel.countDocuments(searchJson).exec());
    if (error) {
        throw new InternalServerErrorException(error.message);
    }
    return data as any;
}

function CreatePopulateExpression(SchemaModel: any, lookup: []) {
    lookup = Object.assign([], lookup);
    if (lookup && lookup.length > 0) {
        lookup.forEach(element => {
            SchemaModel.populate({
                path: element['path'],
                model: element['model'],
                select: element['select'],
                populate: element['populate'] ? element['populate'] : undefined
            });
            try {
                require('../schema/' + element['model'] + '.schema');
                if (element['populate']) {
                    require('../schema/' + element['populate']['model'] + '.schema');
                }
            } catch (error) {
                console.log(error);
            }

        });
    }
    return SchemaModel;
}
function isValidPassword(user: any, password: string) {
    return bCrypt.compareSync(password, user.password);
};

function createHash(password: string) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
};

async function b_DeleteById(objModel: Model<any>, objData: any): Promise<any> {
    let objDbReq: any = objModel.deleteOne({
        _id: objData.id
    });
    const [error, data] = await to(objDbReq.exec());
    if (error) {
        throw new InternalServerErrorException(ErrorMessages.DeleteFail + ', ' + error.message);
    }
    return data as any;
}

async function b_DeleteByIds(objModel: Model<any>, objData: any): Promise<any> {
    let objDbReq: any = objModel.deleteMany({
        _id: {
            $in: objData
        }
    });
    const [error, data] = await to(objDbReq.exec());
    if (error) {
        throw new InternalServerErrorException(ErrorMessages.DeleteFail + ', ' + error.message);
    }
    return data as any;
}

async function b_Update(objModel: Model<any>, objData: any): Promise<any> {
    let objDbReq: any = objModel.findOneAndUpdate(objData.where, objData.item, {
        new: true
    });
    objDbReq = CreatePopulateExpression(objDbReq, objData.lookup);
    if (objData.selectJson) {
        objDbReq.select(objData.selectJson);
    }
    const [error, data] = await to(objDbReq.exec());
    if (error) {
        throw new InternalServerErrorException(ErrorMessages.UpdateFail + ', ' + error.message);
    }
    return data as any;
}

async function b_Create(objModel: Model<any>, objData: any): Promise<any> {
    objData.item.created = new Date();
    objData.item.modified = new Date();
    let objDbReq = new objModel(objData.item);
    const [error, data] = await to(objDbReq.save().exec());
    if (error) {
        throw new InternalServerErrorException(ErrorMessages.CreateFail + ', ' + error.message);
    }
    if (objData.lookup) {
        let m1 = objDbReq.findOne(data);
        m1 = CreatePopulateExpression(m1, objData.lookup);
        const [error1, data1] = await to(m1.save().exec());
        if (error1) {
            throw new InternalServerErrorException(ErrorMessages.CreateFail + ', ' + error1.message);
        }
        return data1 as any;
    }
    return data as any;
}

async function b_Creates(objModel: Model<any>, objData: any): Promise<any> {
    var docs: any[] = objData.docs ? objData.docs : objData.body.docs;
    docs.forEach(doc => {
        doc.created = new Date();
        doc.modified = new Date();
    });
    const [error, data] = await to(objModel.insertMany(docs));
    if (error) {
        throw new InternalServerErrorException(ErrorMessages.GetFail + ', ' + error.message);
    }
    return data as any;
}

async function b_ValidateUser(objModel: Model<any>, objData: any, done: Function): Promise<any> {
    let objDbReq: any = objModel.findOne({ email: objData.email });
    objDbReq = CreatePopulateExpression(objDbReq, objData.lookup);
    const [error, user] = await to(objDbReq.exec());
    if (error) {
        throw new InternalServerErrorException(error.message);
    }
    if (user) {
        if (!isValidPassword(user, objData.password)) {
            throw new InternalServerErrorException("This password is not correct.");
        }
    }
    //return(objData['done'](null, user as any));
    return done(null, user as any);
}