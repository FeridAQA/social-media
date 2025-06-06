import {
  ConflictException,
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { Follow } from 'src/database/entities/Follow.entity';
import { User } from 'src/database/entities/User.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateFollowDto } from './dto/create-follow.dto';

@Injectable()
export class FollowService {
  constructor(
    private cls: ClsService,
    private userService: UserService,
    @InjectRepository(Follow)
    private followRepo: Repository<Follow>,
  ) { }

  async findOne(where: FindOptionsWhere<Follow>) {
    return this.followRepo.findOne({ where });
  }

  async create(params: CreateFollowDto) {
    let myUser = await this.cls.get<Promise<User>>('user');
    let user = await this.userService.findOne({ id: params.userId });

    let checkExist = await this.findOne({
      followerUser: {id:user.id},
      followedUser: {id:myUser.id},
    })
    if (checkExist) {
      throw new ConflictException('You already follow this user');
    }
    let follow = this.followRepo.create({
      followerUser : user,
      followedUser: myUser,
      isAccepted: user.isPrivate ? false : true
    });
    await follow.save()
    return follow

  }
}
