import { ConflictException, Global, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/database/entities/User.entity";
import { DeepPartial, FindManyOptions, FindOptionsWhere, ILike, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { SearchUserDto } from "./dto/search-user.dto";
import { FindUserParams } from "./dto/user.types";
import { SEARCH_USER_SELECT } from "./dto/user.select";

@Global()
@Injectable()

export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>) { }

    async findAll(where?: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
        return this.userRepo.find({ where });
    }
    find(params: FindUserParams) {
        const { where, select, relations, limit, page } = params;

        let payload: FindManyOptions<User> = { where, select, relations };

        if (limit) {
            payload.take = limit;
            payload.skip = page * limit
        }

        return this.userRepo.find(payload);
    }


    findOne(where: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
        return this.userRepo.findOne({ where })
    }


    async create(param: Partial<CreateUserDto>) {
        let checkUserName = await this.findOne({ userName: param.userName });
        if (checkUserName) throw new ConflictException("Username already exists");

        let checkEmail = await this.findOne({ email: param.email });
        if (checkEmail) throw new ConflictException("Email already exists");

        let user = this.userRepo.create(param);
        await user.save();

        return user
    }


    async update(id: number, params: Partial<User>) {
        await this.userRepo.update({ id }, params);
    }

    search(params: SearchUserDto) {
        const { searchParam, limit = 10, page = 0 } = params;
        const where: FindOptionsWhere<User>[] = [
            {
                userName: ILike(`${searchParam}%`),
            },
            {
                email: searchParam,
            },
            {
                firstName: ILike(`%${searchParam}%`),
            },
            {
                lastName: ILike(`%${searchParam}%`),
            },
        ];
        return this.find({where,select:SEARCH_USER_SELECT,page,limit})
    }

}
