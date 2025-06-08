import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/database/entities/Message.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat } from 'src/database/entities/Chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, MessageEntity])],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
