import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { CommonEntity } from './Common.entity';
import { User } from './User.entity';
import { Chat } from './Chat.entity';

@Entity()
export class ChatParticipant extends CommonEntity {
  @ManyToOne(() => User, (user) => user.chatParticipants)
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.participants, { onDelete: 'CASCADE' })
  chat: Chat;

  @Column({ default: 0 })
  unreadCount: number;
}
