import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CommonEntity } from './Common.entity';
import { User } from './User.entity';
import { MessageEntity } from './Message.entity';
import { ChatParticipant } from './ChatParticipant.entity';

@Entity()
export class Chat extends CommonEntity {

  @Column()
  isGroup: boolean;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity


  @OneToOne(() => MessageEntity)
  @JoinColumn({ name: 'lastMessageId' })
  lastMessage: MessageEntity;

  @OneToMany(() => ChatParticipant, (chatParticipant) => chatParticipant.chat, {
    cascade: true,
  })
  participants: ChatParticipant[];
}
