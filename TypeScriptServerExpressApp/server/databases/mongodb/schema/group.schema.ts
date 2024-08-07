import { Document, Schema, Model, model } from 'mongoose';
import baseModel from "../model/base.model";
export interface IGroupDocument extends Document {
    title: String;
    grouppermission: [];
    sitegrouppermission: [];
    createdby: any;
    modifiedby: any;
    created: Date;
    modified: Date;
}

export interface IGroup extends IGroupDocument {
    //comparePassword(password: string): boolean;
}

export interface IGroupModel extends Model<IGroup> {
    //hashPassword(password: string): string;
    fn_Read(obj: any): Promise<IGroupDocument[]>;
}

export const GroupSchema: Schema = new Schema({
    title: {
        type: String,
        uppercase: true,
        required: true,
        unique: true
    },
    grouppermission: [{ type: Schema.Types.ObjectId, ref: "permission" }],
    sitegrouppermission: [
        {
            type: String,
            uppercase: true,
            required: true
        }
    ],
    createdby: {},
    modifiedby: {},
    created: Date,
    modified: Date
});

GroupSchema.method('comparePassword', function (password: string): void {
    //return false;
});


GroupSchema.static('fn_Read', (obj: string): Promise<IGroupDocument[]> => {
    return baseModel.b_Read(Group, obj);
});
//schema.static('fn_Read', function (obj: any): Promise<IGroup[]> { return baseModel.b_Read(Group, obj); });
export const Group: IGroupModel = model<IGroup, IGroupModel>('group', GroupSchema);

export default Group;
