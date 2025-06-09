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
import { CHAT_LIST_SELECT, CHAT_MESSAGES_SELECT } from './chat.select';
import { GetChatMessagesDto } from './dto/get-chat-messages.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedisService } from 'src/shared/libs/redis/redis.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class ChatService {
  constructor(
    private redisService: RedisService,
    private eventEmitter: EventEmitter2,
    private cls: ClsService,
    @InjectRepository(Chat)
    private chatRepo: Repository<Chat>,
    @InjectRepository(MessageEntity)
    private messageRepo: Repository<MessageEntity>,
  ) { }

  findById(id: number) {
    return this.chatRepo.findOne({
      where: { id },
      relations: ['participants', 'participants.user'],
    });
  }


  async getChats() {
    const myUser = await this.cls.get<User>('user')


    let cacheData = await this.redisService.get(`chatlist${myUser.id}`);
    if (cacheData) {
      console.log('DATA FROM CACHE');
      return JSON.parse(cacheData.toString());
    }

    let chats = await this.chatRepo
      .createQueryBuilder('chat')
      .select(CHAT_LIST_SELECT)
      .leftJoin('chat.lastMessage', 'lastMessage')
      .leftJoin('lastMessage.sender', 'sender')
      .leftJoin('sender.profilePicture', 'senderProfilePicture')
      .leftJoin('chat.participants', 'participants')
      .leftJoin('participants.user', 'users')
      .leftJoin('chat.participants', 'myParticipant')
      .where(`myParticipant.userId=:userId`, { userId: myUser.id })
      .getMany()

    let result = chats.map((chat) => {
      let myParticipant = chat.participants.find(
        (p) => p.user.id === myUser.id,
      );
      return {
        ...chat,
        unreadCount: myParticipant.unreadCount,
        everyoneRead: !chat.participants.find((p) => p.unreadCount > 0),
        participants: undefined,
      };
    });

    await this.redisService.set(`chatlist${myUser.id}`, JSON.stringify(result));

    return result;
  }

  async getChatMessages(chatId: number, params: GetChatMessagesDto) {
    const { limit = 10, page = 0 } = params;

    const myUser = await this.cls.get<User>('user');

    let chat = await this.chatRepo
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'users')
      .where('chat.id =:chatId', { chatId })
      .getOne();

    if (!chat || !chat.participants.find((p) => p.user.id === myUser.id))
      throw new NotFoundException('Chat is not found');

    let messages = await this.messageRepo.find({
      where: {
        chat: {
          id: chat.id,
        },
      },
      select: CHAT_MESSAGES_SELECT,
      order: {
        id: 'DESC',
      },
      take: limit,
      skip: limit * page,
      relations: ['sender'],
    });

    let myParticipant = chat.participants.find((p) => p.user.id === myUser.id);
    myParticipant.unreadCount = 0;

    messages.forEach((message) => {
      if (!message.readBy.includes(myUser.id)) {
        message.readBy.push(myUser.id);
      }
    });

    await Promise.all([myParticipant.save(), this.messageRepo.save(messages)]);


    return messages;
  }





  async findOrCreateChat(params: { chatId?: number; userId?: number }) {
    let { chatId, userId } = params;
    let isNew = false;

    const myUser = await this.cls.get<User>('user');

    if (myUser.id === userId)
      throw new BadRequestException('You can not send message to yourself');

    let chat: Chat;
    if (userId) {
      chat = await this.chatRepo
        .createQueryBuilder('chat')
        .leftJoinAndSelect(`chat.participants`, 'participants')
        .leftJoinAndSelect('participants.user', 'users')
        .innerJoin('chat.participants', 'p1', 'p1.userId = :myUserId', {
          myUserId: myUser.id,
        })
        .innerJoin('chat.participants', 'p2', 'p2.userId = :userId', {
          userId,
        })
        .getOne();

      if (!chat) {
        chat = this.chatRepo.create({
          isGroup: false,
          participants: [
            {
              user: {
                id: myUser.id,
              },
            },
            {
              user: {
                id: userId,
              },
            },
          ],
        });
        await chat.save();
        isNew = true;
      }
    } else if (chatId) {
      chat = await this.chatRepo.findOne({
        where: { id: chatId },
        relations: ['participants', 'participants.user'],
      });
      if (
        !chat ||
        !chat.participants.find(
          (participant) => participant.user.id === myUser.id,
        )
      ) {
        throw new NotFoundException();
      }
    } else return {};

    return { chat, isNew };
  }
  async sendMessage(params: SendMessageDto) {
    let { userId, chatId } = params;

    let myUser = await this.cls.get<User>('user');
    let { chat, isNew } = await this.findOrCreateChat({ userId, chatId });

    if (!chat) throw new BadRequestException();

    let message = this.messageRepo.create({
      chat: {
        id: chat.id,
      },
      message: params.messsage,
      sender: {
        id: myUser.id,
      },
      readBy: [myUser.id],
    });

    await message.save();

    chat.lastMessage = { id: message.id } as MessageEntity;

    chat.participants.map((participant) => {
      if (participant.user.id === myUser.id) return participant;
      else {
        participant.unreadCount++;
      }
    });

    await chat.save();

    if (isNew) {
      this.eventEmitter.emit('chat.create', { chat, message });
    } else {
      this.eventEmitter.emit('chat.update', { chat, message });
    }
    this.eventEmitter.emit('message.create', { chat, message });

    await Promise.all(
      chat.participants.map((p) =>
        this.redisService.delete(`chatlist${p.user.id}`),
      ),
    );

    return {
      status: true,
      message: 'Message is sent',
    };
  }


  async createGroup(body: CreateGroupDto) {
    const { userIds, name } = body;

    const myUser = await this.cls.get<User>('user');
    let chat = this.chatRepo.create({
      isGroup: true,
      name,
      participants: [...userIds, myUser.id].map((id) => ({
        user: {
          id,
        },
      })),
    });
    await Promise.all(
      chat.participants.map((p) =>
        this.redisService.delete(`chatlist${p.user.id}`),
      ),
    );
    await chat.save();
    return chat;
  }
}

