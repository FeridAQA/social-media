import {
  Body,
  Controller,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGard } from 'src/guards/auth.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(AuthGard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  sendMessage(@Body() body:SendMessageDto){
    return this.chatService.sendMesssage(body)
  }
}
