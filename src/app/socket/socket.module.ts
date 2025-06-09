import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ChatModule } from 'src/app/chat/chat.module';

@Module({
  imports: [ChatModule],
  providers: [SocketGateway],
})
export class SocketModule {}
