import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { Chat } from 'src/database/entities/Chat.entity';
import { MessageEntity } from 'src/database/entities/Message.entity';
import { User } from 'src/database/entities/User.entity';
import { Repository } from 'typeorm';
import { SendMessageDto } from './dto/send-message.dto';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { RedisService } from 'src/shared/libs/redis/redis.service';

@Injectable()
export class ChatService {
  constructor(
    // private redisService: RedisService,
    // private eventEmitter: EventEmitter2,
    private cls: ClsService,
    @InjectRepository(Chat)
    private chatRepo: Repository<Chat>,
    @InjectRepository(MessageEntity)
    private messageRepo: Repository<MessageEntity>,
  ) { }

  async findOrCreateChat(params: { chatId?: number; userId?: number }) {
    let { chatId, userId } = params

    const myUser = await this.cls.get<User>('user')

    let chat: any
    if (userId) {
      chat = await this.chatRepo
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.participants', 'participants')
        .leftJoinAndSelect('participants.user', 'users')
        .where(`users.id In(:...ids)`, { ids: [myUser.id, userId] })
        .getOne()
      if (!chat) {
        chat = this.chatRepo.create({
          isGroup: false,
          participants: [
            {
              user: { id: myUser.id }
            },
            {
              user: { id: userId }
            }
          ]
        })
        await chat.save()
      }
    } else if (userId) {
      chat = await this.chatRepo.findOne({
        where: { id: chatId },
        relations: ['participants', 'participants.users'],
      })
      if (!chat || !chat.participants.find((participants) => participants.user.id === myUser.id)) {
        throw new NotFoundException()
      } else return false
    }
    return chat
  }


  async sendMesssage(params: SendMessageDto) {
    let { chatId, userId } = params

    const myUser = await this.cls.get<User>('user')

    let chat = await this.findOrCreateChat({ chatId, userId })

    if (!chat) throw new BadRequestException()

    let message = this.messageRepo.create({
      chat: {
        id: chat.id
      },
      message: params.messsage,
      sender:{
        id:myUser.id
      },
      readBy: [myUser.id]
    })
    await message.save()

    chat.lastMessage = {id:message.id}

    chat.participants.map((participant) => {
      if (participant.user.id === myUser.id) return participant
      else {
        participant.unreadCount++
      }
    })

    await chat.save()

    return {
      status:true,
      message
    }
  }
}

