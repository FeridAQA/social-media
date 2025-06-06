import {
  Body,
  Controller,
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

  @Post()
  createFollow(@Body() body: CreateFollowDto) {
    return this.followService.create(body);
  }
 
}
