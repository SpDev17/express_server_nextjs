import { Document } from 'mongoose';

export interface IUser extends Document {
    name: String;
    title: String;
    first_name: String;
    last_name: String;
    mobile: Number;
    alternate_contact_no: String;
    email: String;
    isactive: Boolean;
    groups: any;
    password: String;
    provider: String;
    salt: String;
    facebook: any;
    twitter: any;
    google: any;
    github: any;
    createdby: any;
    modifiedby: any;
    created: Date;
    modified: Date;
    
}