import { IPermissionDocument } from '../../../databases/mongodb/schema/permission.schema';

export class permissionDTO {
    id!: string;
    title!: String;
    createdby: any;
    modifiedby: any;
    created!: Date;
    modified!: Date;

    static toResponse(p: IPermissionDocument): permissionDTO {
        const userDTO = new permissionDTO();
        userDTO.id = p._id as string;
        userDTO.title = p.title as string;
        //userDTO.createdby = p.createdby as any;
        //userDTO.modifiedby = p.modifiedby as any;
        //userDTO.created = p.created as Date;
        //userDTO.modified = p.modified as Date;
        return userDTO;
    }
}