import { IGroupPermissionDocument } from '../../../databases/mongodb/schema/grouppermission.schema';

export class groupPermissionDTO {
    id!: string;
    title!: String;
    group!: String;
    permission!: [];
    static toResponse(p: IGroupPermissionDocument): groupPermissionDTO {
        const userDTO = new groupPermissionDTO();
        userDTO.id = p._id as string;
        userDTO.title = p.title as string;
        userDTO.group = p.group as string;
        userDTO.permission = p.permission as [];
        return userDTO;
    }
}