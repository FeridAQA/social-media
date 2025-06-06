import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGard } from 'src/guards/auth.guard';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowService } from './follow.service';

@Controller('follow')
@ApiBearerAuth()
@ApiTags('Follow')
@UseGuards(AuthGard)
export class FollowController {
  constructor(private followService: FollowService) {}

  @Get('requests')
  followRequests() {
    return this.followService.followRequests();
  }

  

  @Post()
  createFollow(@Body() body: CreateFollowDto) {
    return this.followService.create(body);
  }

  @Post('/accept/:userId')
  acceptFollow(@Param('userId') userId: number) {
    return this.followService.accept(userId);
  }

  @Post('/reject/:userId')
  rejectFollow(@Param('userId') userId: number) {
    return this.followService.reject(userId);
  }
 
}
