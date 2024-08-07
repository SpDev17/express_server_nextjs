import { Document, Schema, Model, model } from 'mongoose';
import baseModel from "../model/base.model";
export interface IUserDocument extends Document {
    name: String;
    title: String;
    first_name: String;
    last_name: String;
    mobile: Number;
    alternate_contact_no: String;
    email: String;
    isactive: Boolean;
    groups: [];
    password: String;
    provider: String;
    salt: String;
    facebook: {};
    twitter: {};
    google: {};
    github: {};
    createdby: {};
    modifiedby: {};
    created: Date;
    modified: Date;
}

export interface IUser extends IUserDocument {
    //comparePassword(password: string): boolean;
}

export interface IUserModel extends Model<IUser> {
    //hashPassword(password: string): string;
    fn_Read(obj: any): Promise<IUserDocument[]>;
    fn_ReadById(obj: any): Promise<IUserDocument>;
    fn_GetCount(obj: any): Promise<any>;
    fn_DeleteById(obj: any): Promise<IUserDocument>;
    fn_DeleteByIds(obj: any): Promise<any>;
    fn_Update(obj: any): Promise<any>;
    fn_ValidateUser(obj: any, done: Function): Promise<any>;
}

export const UserSchema: Schema = new Schema({
    name: String,
    title: String,
    first_name: String,
    last_name: String,
    mobile: Number,
    alternate_contact_no: String,
    email: {
        type: String,
        lowercase: true,
        required: true
    },
    isactive: Boolean,
    groups: [{
        type: Schema.Types.ObjectId,
        ref: "group"
    }],
    password: String,
    provider: String,
    salt: String,
    facebook: {},
    twitter: {},
    google: {},
    github: {},
    createdby: {},
    modifiedby: {},
    created: Date,
    modified: Date
});

UserSchema.method('comparePassword', function (password: string): void {
    //return false;
});

UserSchema.static('fn_Read', (obj: any): Promise<IUserDocument[]> => {
    return baseModel.b_Read(User, obj);
});
UserSchema.static('fn_ReadById', (obj: any): Promise<IUserDocument> => {
    return baseModel.b_ReadById(User, obj);
});

UserSchema.static('fn_GetCount', (obj: any): Promise<any> => {
    return baseModel.b_GetCount(User, obj);
});
UserSchema.static('fn_DeleteById', (obj: any): Promise<IUserDocument> => {
    return baseModel.b_DeleteById(User, obj);
});
UserSchema.static('fn_DeleteByIds', (obj: any): Promise<IUserDocument> => {
    return baseModel.b_DeleteByIds(User, obj);
});
UserSchema.static('fn_Update', (obj: any): Promise<IUserDocument> => {
    return baseModel.b_Update(User, obj);
});
UserSchema.static('fn_ValidateUser', (obj: any, done: Function): Promise<IUserDocument> => {
    return baseModel.b_ValidateUser(User, obj, done);
});
//schema.static('fn_Read', function (obj: any): Promise<IUser[]> { return baseModel.b_Read(User, obj); });
export const User: IUserModel = model<IUser, IUserModel>('user', UserSchema);

export default User;
