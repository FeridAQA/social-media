import { ConflictException, Global, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/database/entities/User.entity";
import { DeepPartial, FindManyOptions, FindOptionsWhere, ILike, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { SearchUserDto } from "./dto/search-user.dto";
import { FindUserParams } from "./dto/user.types";
import { SEARCH_USER_SELECT } from "./dto/user.select";
import { ClsService } from "nestjs-cls";

@Global()
@Injectable()

export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private cls: ClsService
    ) { }


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

    async search(params: SearchUserDto) {
        const { searchParam, limit = 10, page = 0 } = params;
        const myUser = await this.cls.get<User>('user')
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

        let relations = ['followers','followers.followedUser']


        let users = this.find({ where, select: SEARCH_USER_SELECT, page, limit, relations })

        let mappedUsers = (await users).map((user) => {
            let isFollowing =user.followers.find(
                (follow) => follow.followedUser.id === myUser.id
            )!==undefined

            return {
                ...user,
                isFollowing,
                followers: undefined
            }
        })

        return mappedUsers
    }

}
