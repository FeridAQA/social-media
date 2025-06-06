import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from 'src/database/entities/Follow.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateFollowDto } from './dto/create-follow.dto';
import { ClsService } from 'nestjs-cls';
import { User } from 'src/database/entities/User.entity';
import { UserService } from '../user/user.service';
import { FollowStatus } from 'src/shared/enum/follow.enum';
import { FindParams } from 'src/shared/types/find.params';
import { FOLLOW_REQUEST_LIST_SELECT } from './follow.select';

@Injectable()
export class FollowService {
  constructor(
    private cls: ClsService,
    private userService: UserService,
    @InjectRepository(Follow)
    private followRepo: Repository<Follow>,
  ) {}




  async create(params: CreateFollowDto) {
    let myUser = await this.cls.get<Promise<User>>('user');
    let user = await this.userService.findOne( { id: params.userId } );

}
}
