import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { Follow } from 'src/database/entities/Follow.entity';
import { User } from 'src/database/entities/User.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowStatus } from 'src/shared/enum/follow.enum';
import { FindParams } from 'src/shared/types/find.params';
import { FOLLOW_REQUEST_LIST_SELECT } from './follow.select';

@Injectable()
export class FollowService {
  constructor(
    private cls: ClsService,
    
    @Inject(forwardRef(() => UserService))
    private userService: UserService,

    
    @InjectRepository(Follow)
    private followRepo: Repository<Follow>,
  ) { }


  async find(params: FindParams<Follow>) {
    const { where, select, relations } = params;
    return this.followRepo.find({ where, select, relations });
  }
  async findOne(params: Omit<FindParams<Follow>, 'limit' | 'page'>) {
    const { where, select, relations } = params;
    return this.followRepo.findOne({ where, select, relations });
  }

  async create(params: CreateFollowDto) {
    let myUser = await this.cls.get<Promise<User>>('user');
    let user = await this.userService.findOne({ where: { id: params.userId } });

    let checkExist = await this.findOne({
      where: {
        follower: { id: user.id },
        followed: { id: myUser.id },
      }
    })
    if (checkExist) {
      throw new ConflictException('You already follow this user');
    }
    let follow = this.followRepo.create({
      follower: { id: user.id },
      followed: { id: myUser.id },
      status: user.isPrivate ? FollowStatus.WAITING : FollowStatus.FOLLOWING
    });

    if (!user.isPrivate) {
      user.followerCount++
      myUser.followedCount++
      await Promise.all([user.save(), myUser.save()])
    }

    await follow.save()
    return follow

  }

  async accept(userId: number) {
    let myUser = await this.cls.get<User>('user');
    let user = await this.userService.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException();

    let follow = await this.findOne({
      where: {
        // follewed user gonderen 
        followed: { id: user.id },

        // follower user gonderilen 
        follower: { id: myUser.id },

      }
    },
    );

    if (!follow) throw new NotFoundException('Follow requeset is not found')

    if (follow.status != FollowStatus.WAITING)
      throw new BadRequestException('you have already accepted this request')

    follow.status = FollowStatus.FOLLOWING

    myUser.followerCount++
    user.followedCount++
    await Promise.all([follow.save(), myUser.save(), user.save()]);
    return {
      status: true,
      message: 'you have accepted follow request'
    }
  }

  async reject(userId: number) {
    let myUser = await this.cls.get<User>('user');
    let user = await this.userService.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException();

    let follow = await this.findOne({
      where: {
        // follewed user gonderen 
        followed: { id: user.id },

        // follower user gonderilen 
        follower: { id: myUser.id },
      }
    },
    );

    if (!follow) throw new NotFoundException('Follow requeset is not found')

    if (follow.status != FollowStatus.WAITING)
      throw new BadRequestException('you have already accepted this request')

    await follow.remove()

    return {
      status: true,
      message: 'you have rejected follow request'
    }
  }

  // gelen follow u qebul etmir 
  async removeFollow(userId: number) {
    let myUser = await this.cls.get<User>('user');
    let user = await this.userService.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException();

    let follow = await this.findOne({
      where: {
        // follewed user gonderen 
        followed: { id: user.id },

        // follower user gonderilen 
        follower: { id: myUser.id },
      },
    }
    );

    if (!follow) throw new NotFoundException('Follow requeset is not found')

    if (follow.status === FollowStatus.FOLLOWING) {
      myUser.followerCount--
      user.followedCount--
      await Promise.all([user.save(), myUser.save()])
    }

    await follow.remove()

    return {
      status: true,
      message: 'you have rejected follow request'
    }
  }

  // artiq follow etmek istemirem 
  async unfollow(userId: number) {
    let myUser = await this.cls.get<User>('user');
    let user = await this.userService.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException();

    let follow = await this.findOne({
      where: {
        // follewed user gonderen 
        followed: { id: myUser.id },

        // follower user gonderilen 
        follower: { id: user.id },
      },
    }
    );

    if (!follow) throw new NotFoundException('Follow requeset is not found')

    if (follow.status === FollowStatus.FOLLOWING) {
      user.followerCount--
      myUser.followedCount--
      await Promise.all([user.save(), myUser.save()])
    }

    await follow.remove()

    return {
      status: true,
      message: 'you have rejected follow request'
    }
  }



  async followRequests() {
    let myUser = await this.cls.get<User>('user');

    return this.find({
      where: {
        follower: { id: myUser.id },
        status: FollowStatus.WAITING,
      },
      relations: ['followed'],
      select: FOLLOW_REQUEST_LIST_SELECT,
    });
  }

  async acceptAllRequsts(userId: number) {
    return await this.followRepo.update(
      {
        status: FollowStatus.WAITING,
        follower: {
          id: userId,
        },
      },
      { status: FollowStatus.FOLLOWING },
    );
  }

}
