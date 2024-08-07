import { IGroupDocument } from '../../../databases/mongodb/schema/group.schema';

export class groupDTO {
    id!: string;
    title!: String;
    grouppermission!: [];
    sitegrouppermission!: [];
    createdby: any;
    modifiedby: any;
    created!: Date;
    modified!: Date;
    static toResponse(p: IGroupDocument): groupDTO {
        const dto = new groupDTO();
        dto.id = p._id as string;
        dto.title = p.title as string;
        dto.grouppermission = p.grouppermission as [];
        dto.sitegrouppermission = p.sitegrouppermission as [];
        dto.createdby = p.createdby as string;
        dto.modifiedby = p.modifiedby as string;
        dto.created = p.created as Date;
        dto.modified = p.modified as Date;
        return dto;
    }
}