import { IUser } from '../../../databases/mongodb/model/user.model';
import { IUserDocument } from '../../../databases/mongodb/schema/user.schema';
export class userDTO {
    id!: string;
    first_name!: string;
    last_name!: string;
    email!: string;
    groups!: [];

    static toResponse(user: IUserDocument): userDTO {
        const dto = new userDTO();
        dto.id = user._id as string;
        dto.first_name = user.first_name as string;
        dto.last_name = user.last_name as string;
        dto.email = user.email as string;
        dto.groups = user.groups as [];
        return dto;
    }
}
