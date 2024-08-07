import { IRestaurantDocument } from '../../../databases/mongodb/schema/restaurants.schema';
export class restaurantDTO {
    id!: string;
    address!: string;
    borough!: string;
    cuisine!: string;
    grades!: [];
    name!: string;
    restaurant_id!: string;

    static toResponse(r: IRestaurantDocument): restaurantDTO {
        const dto = new restaurantDTO();
        dto.id = r._id as string;
        dto.address = r.address as any;
        dto.borough = r.borough as string;
        dto.cuisine = r.cuisine as string;
        dto.grades = r.grades as [];
        dto.restaurant_id = r.restaurant_id as string;
        return dto;
    }
}
