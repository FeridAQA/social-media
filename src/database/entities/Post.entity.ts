import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { CommonEntity } from './Common.entity';
import { ImageEntity } from './Image.entity';
import { User } from './User.entity';

@Entity()
export class PostEntity extends CommonEntity {
  @ManyToMany(() => ImageEntity, { eager: true })
  @JoinTable({ name: 'post_image' })
  images: ImageEntity[];

  @Column()
  description: string;

  @Column({ type: 'json', default: [] })
  likes: number[];

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;
}
