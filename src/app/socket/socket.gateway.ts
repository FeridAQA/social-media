import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/app/chat/chat.service';
import { UserService } from 'src/app/user/user.service';
import { Chat } from 'src/database/entities/Chat.entity';
import { MessageEntity } from 'src/database/entities/Message.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private chatService: ChatService,
  ) { }

  @SubscribeMessage('auth')
  async handleAuth(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const token = body?.token;
    try {
      let payload = this.jwtService.verify(token);
      if (!payload.userId) throw new Error('user is not found');

      let user = await this.userService.findOne({
        where: { id: payload.userId },
      });
      if (!user) throw new Error('user is not found');

      client.data.user = user;
      client.emit('auth', {
        status: true,
        userId: user.id,
        message: 'user is successfully logged in',
      });
    } catch (err: any) {
      client.emit('auth', { status: false, error: err?.message });
    }
  }

  @SubscribeMessage('chat')
  handleChat(@MessageBody() body: any) {
    console.log(body);
  }

  @SubscribeMessage('writing')
  async writingStatus(
    @MessageBody() body: { chatId: number; status: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId = 0, status } = body || {};

    const user = client.data?.user;
    const userId = user?.id;
    if (!userId) return;

    let chat = await this.chatService.findById(chatId);

    if (!chat.participants.find((p) => p.user.id === userId)) return;

    let participants = chat.participants.filter((p) => p.user.id != userId);

    let sockets = await this.server.fetchSockets();
    for (let participant of participants) {
      let participantSocket = sockets.find(
        (socket) => socket.data?.user?.id === participant.user.id,
      );
      if (!participantSocket) continue;

      participantSocket.emit('chat.writing', {
        userId,
        username: user.username,
        status,
      });
    }
  }

  @OnEvent('message.create')
  async handleMessageCreate(payload: { chat: Chat; message: MessageEntity }) {
    const { chat, message } = payload;
    let receivers = chat.participants.filter(
      (p) => p.user.id != message.sender.id,
    );

    let sockets = await this.server.sockets.fetchSockets();
    for (let receiver of receivers) {
      let receiverSocket = sockets.find(
        (socket) => socket.data?.user?.id == receiver.user.id,
      );

      if (!receiverSocket) continue;
      receiverSocket.emit('message.create', message);
    }
  }

  @OnEvent('chat.create')
  async handleCreateChat(payload: { chat: Chat; message: MessageEntity }) {
    const { chat, message } = payload;
    let participants = chat.participants.filter(
      (p) => p.user.id != message.sender.id,
    );
    let sockets = await this.server.fetchSockets();

    for (let participant of participants) {
      let socket = sockets.find(
        (socket) => socket.data?.user?.id == participant.user.id,
      );
      if (!socket) continue;

      socket.emit('chat.create', chat);
    }
  }

  @OnEvent('chat.update')
  async handleUpdateChat(payload: { chat: Chat; message: MessageEntity }) {
    const { chat, message } = payload;
    let participants = chat.participants.filter(
      (p) => p.user.id != message.sender.id,
    );
    let sockets = await this.server.fetchSockets();

    for (let participant of participants) {
      let socket = sockets.find(
        (socket) => socket.data?.user?.id == participant.user.id,
      );
      if (!socket) continue;

      socket.emit('chat.update', chat);
    }
  }

}
