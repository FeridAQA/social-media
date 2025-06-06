import { User } from "src/database/entities/User.entity";
import { FindOptionsSelect } from "typeorm";

export const SEARCH_USER_SELECT: FindOptionsSelect<User> = {
    id: true,
    userName: true,
    firstName: true,
    lastName: true,
    profilePicture: {
        url: true,
    },
};