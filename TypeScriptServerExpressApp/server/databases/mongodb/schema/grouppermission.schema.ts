import { Document, Schema, Model, model } from 'mongoose';
import baseModel from "../model/base.model";
export interface IGroupPermissionDocument extends Document {
    title: String;
    group: String;
    permission: [];
}

export interface IGroupPermission extends IGroupPermissionDocument {
    //comparePassword(password: string): boolean;
}

export interface IGroupPermissionModel extends Model<IGroupPermission> {
    fn_Read(obj: any): Promise<IGroupPermissionDocument[]>;
}

export const GroupPermissionSchema: Schema = new Schema({
    title: {
        type: String,
        lowercase: true,
        required: true
    },
    group: {
        type: String,
        lowercase: true,
        required: true
    },
    permission: [{
        type: String,
        lowercase: true,
        required: true
    }]
});

GroupPermissionSchema.static('fn_Read', (obj: string): Promise<IGroupPermissionDocument[]> => {
    return baseModel.b_Read(GroupPermission, obj);
});
export const GroupPermission: IGroupPermissionModel = model<IGroupPermission, IGroupPermissionModel>('grouppermission', GroupPermissionSchema);
export default GroupPermission;
