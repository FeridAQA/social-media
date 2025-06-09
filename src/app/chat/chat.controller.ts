import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGard } from 'src/guards/auth.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { GetChatMessagesDto } from './dto/get-chat-messages.dto';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('chat')
@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(AuthGard)
export class ChatController {
  constructor(private chatService: ChatService) { }


  @Get()
  getChats() {
    return this.chatService.getChats();
  }

  @Get(':chatId')
  getChatMessages(
    @Param('chatId') chatId: number,
    @Query() body: GetChatMessagesDto,
  ) {
    return this.chatService.getChatMessages(chatId, body);
  }


  @Post()
  sendMessage(@Body() body: SendMessageDto) {
    return this.chatService.sendMessage(body)
  }

  @Post('/group')
  createGroup(@Body() body: CreateGroupDto) {
    return this.chatService.createGroup(body);
  }
}
