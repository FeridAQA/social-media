import { ConflictException, Global, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/database/entities/User.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";

@Global()
@Injectable()

export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>) { }

    findone(where: FindOptionsWhere<User>| FindOptionsWhere<User>[]) {
        return this.userRepo.findOne({ where })
    }

    async create(param: Partial<CreateUserDto>) {       
        let checkUserName = await this.findone({ userName: param.userName });
        if (checkUserName) throw new ConflictException("Username already exists");

        let checkEmail = await this.findone({ email: param.email });
        if (checkEmail) throw new ConflictException("Email already exists");
        
        let user = this.userRepo.create(param);
        await user.save();

        return  user
    }
}