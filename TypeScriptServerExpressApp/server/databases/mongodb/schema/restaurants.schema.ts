import { Document, Schema, Model, model } from 'mongoose';
import baseModel from "../model/base.model";
export interface IRestaurantDocument extends Document {
    address: {};
    borough: String;
    cuisine: String;
    grades: [];
    name: String;
    restaurant_id: String;
}

export interface IRestaurant extends IRestaurantDocument {
    //comparePassword(password: string): boolean;
}

export interface IRestaurantModel extends Model<IRestaurant> {
    //hashPassword(password: string): string;
    fn_Read(obj: any): Promise<IRestaurantDocument[]>;
    fn_ReadById(obj: any): Promise<IRestaurantDocument>;
    fn_GetCount(obj: any): Promise<any>;
    fn_DeleteById(obj: any): Promise<IRestaurantDocument>;
    fn_DeleteByIds(obj: any): Promise<any>;
    fn_Update(obj: any): Promise<any>;
    fn_ValidateUser(obj: any): Promise<any>;
}

export const UserSchema: Schema = new Schema({
    address: {},
    borough: String,
    cuisine: String,
    grades: [],
    name: String,
    restaurant_id: String
});

UserSchema.method('comparePassword', function (password: string): void {
    //return false;
});

UserSchema.static('fn_Read', (obj: any): Promise<IRestaurantDocument[]> => {
    return baseModel.b_Read(User, obj);
});
UserSchema.static('fn_ReadById', (obj: any): Promise<IRestaurantDocument> => {
    return baseModel.b_ReadById(User, obj);
});

UserSchema.static('fn_GetCount', (obj: any): Promise<any> => {
    return baseModel.b_GetCount(User, obj);
});
UserSchema.static('fn_DeleteById', (obj: any): Promise<IRestaurantDocument> => {
    return baseModel.b_DeleteById(User, obj);
});
UserSchema.static('fn_DeleteByIds', (obj: any): Promise<IRestaurantDocument> => {
    return baseModel.b_DeleteByIds(User, obj);
});
UserSchema.static('fn_Update', (obj: any): Promise<IRestaurantDocument> => {
    return baseModel.b_Update(User, obj);
});
UserSchema.static('fn_ValidateUser', (obj: any,done: Function): Promise<IRestaurantDocument> => {
    return baseModel.b_ValidateUser(User, obj,done);
});
//schema.static('fn_Read', function (obj: any): Promise<IUser[]> { return baseModel.b_Read(User, obj); });
export const User: IRestaurantModel = model<IRestaurant, IRestaurantModel>('restaurants', UserSchema);

export default User;
