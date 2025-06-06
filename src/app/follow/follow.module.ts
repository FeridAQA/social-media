import { forwardRef, Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from 'src/database/entities/Follow.entity';
import { FollowService } from './follow.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Follow]), UserModule],
  controllers: [FollowController],
  exports: [FollowService],
  providers: [FollowService],
})
export class FollowModule { }
