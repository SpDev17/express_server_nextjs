import { Document, Schema, Model, model } from 'mongoose';
import baseModel from "../model/base.model";
export interface IPermissionDocument extends Document {
    title: String;
    createdby: any;
    modifiedby: any;
    created: Date;
    modified: Date;
}

export interface IPermission extends IPermissionDocument {
    comparePassword(password: string): boolean;
}

export interface IPermissionModel extends Model<IPermission> {
    hashPassword(password: string): string;
    fn_Read(obj: any): Promise<IPermissionDocument[]>;
}

export const PermissionSchema: Schema = new Schema({
    title: {
        type: String,
        uppercase: true,
        required: true
    },
    createdby: {},
    modifiedby: {},
    created: Date,
    modified: Date
});

PermissionSchema.method('comparePassword', function (password: string): boolean {

    return false;
});

PermissionSchema.static('hashPassword', (password: string): string => {
    return "ok";
});
PermissionSchema.static('fn_Read', (obj: string): Promise<IPermissionDocument[]> => {
    return baseModel.b_Read(Permission, obj);
});
//schema.static('fn_Read', function (obj: any): Promise<IPermission[]> { return baseModel.b_Read(Permission, obj); });
export const Permission: IPermissionModel = model<IPermission, IPermissionModel>('permission', PermissionSchema);

export default Permission;
