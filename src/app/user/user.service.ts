import { ConflictException, forwardRef, Global, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/database/entities/User.entity";
import { DeepPartial, FindManyOptions, FindOptionsWhere, ILike, Not, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { SearchUserDto } from "./dto/search-user.dto";
import { USER_BASIC_SELECT, USER_PROFILE_SELECT } from "./user.select";
import { ClsService } from "nestjs-cls";
import { NotFoundError } from "rxjs";
import { FollowStatus } from "src/shared/enum/follow.enum";
import { FindParams } from "src/shared/types/find.params";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FollowService } from "../follow/follow.service";

@Global()
@Injectable()

export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private cls: ClsService,

        @Inject(forwardRef(() => FollowService))
        private followService: FollowService,
    ) { }


    async findAll(where?: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
        return this.userRepo.find({ where });
    }
    find(params: FindParams<User>) {
        const { where, select, relations, limit, page } = params;

        let payload: FindManyOptions<User> = { where, select, relations };

        if (limit) {
            payload.take = limit;
            payload.skip = page * limit
        }

        return this.userRepo.find(payload);
    }


    findOne(params: FindParams<User>) {
        const { where, select, relations } = params
        return this.userRepo.findOne({ where, select, relations })
    }

    async userProfile(id: number) {
        const myUser = await this.cls.get<User>('user')

        let relations = ['myFollowers', 'myFollowers.followed']
        const user = await this.findOne(
            { where: { id }, relations, select: USER_PROFILE_SELECT }
        )
        if (!user) throw new NotFoundException()

        const followStatus = user.myFollowers.find((follow) => follow.followed.id == myUser.id)
            ?.status || FollowStatus.NOT_FOLLOWING
        let result = { ...user, followStatus, myFollowers: undefined }
        return result
    }


    async create(param: Partial<CreateUserDto>) {
        let checkUserName = await this.findOne({ where: { userName: param.userName } });
        if (checkUserName) throw new ConflictException("Username already exists");

        let checkEmail = await this.findOne({ where: { email: param.email } });
        if (checkEmail) throw new ConflictException("Email already exists");

        let user = this.userRepo.create(param);
        await user.save();

        return user
    }


    async update(id: number, params: Partial<User>) {
        return await this.userRepo.update({ id }, params);
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

        let relations = ['myFollowers', 'myFollowers.followed']


        let users = this.find({ where, select: USER_BASIC_SELECT, page, limit, relations })

        let mappedUsers = (await users).map((user) => {
            let followStatus = user.myFollowers.find(
                (follow) => follow.followed.id === myUser.id
            )?.status || FollowStatus.NOT_FOLLOWING

            return {
                ...user,
                followStatus,
                myFollowers: undefined
            }
        })

        return mappedUsers
    }


    async updateProfile(params: Partial<UpdateUserDto>) {
        let myUser = await this.cls.get<User>('user')

        let payload: Partial<User> = {};

        for (let key in params) {
            switch (key) {
                case 'isPrivate':
                    payload.isPrivate = params.isPrivate;
                    if (params.isPrivate === false) {
                        await this.followService.acceptAllRequsts(myUser.id);
                    }

                    break;
                case 'profilePictureId':
                    payload.profilePicture = {
                        id: params.profilePictureId
                    }
                    break
                case 'userName':
                    let checkUserName = await this.findOne({ where: { userName: params.userName, id: Not(myUser.id) } });
                    if (checkUserName && checkUserName.id !== myUser.id) throw new ConflictException("Username already exists");
                    payload.userName = params.userName
                    break
                default:
                    payload[key] = params[key]
                    break

            }
        }
        return this.update(myUser.id, payload)

    }

}
