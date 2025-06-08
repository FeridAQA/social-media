import { MessageEntity } from 'src/database/entities/Message.entity';
import { FindOptionsSelect } from 'typeorm';

export const CHAT_LIST_SELECT = [
  'chat.id',
  // 'chat.name',
  'chat.isGroup',
  'chat.lastMessage.id',
  'lastMessage.message',
  'lastMessage.readBy',
  'sender.id',
  'sender.userName',
  'senderProfilePicture.id',
  'senderProfilePicture.url',
  'participants.id',
  'users.id',
  'users.userName',
  'participants.unreadCount',
];

export const CHAT_MESSAGES_SELECT: FindOptionsSelect<MessageEntity> = {
  id: true,
  createdAt: true,
  readBy: true,
  message: true,
  sender: {
    id: true,
    profilePicture: {
      url: true,
    },
    userName: true,
  },
};
