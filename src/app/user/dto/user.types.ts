import { User } from "src/database/entities/User.entity";
import {  FindOptionsSelect, FindOptionsWhere } from "typeorm";

export interface FindUserParams {
    where?: FindOptionsWhere<User> | FindOptionsWhere<User>[]
    select?:FindOptionsSelect<User>
    relations?: string[];
    limit?: number;
    page?: number;  
} 