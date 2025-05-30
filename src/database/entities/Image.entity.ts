import { BeforeRemove, Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from './Common.entity';
import { rmSync } from 'fs';
import { join } from 'path';

@Entity('image')
export class ImageEntity extends CommonEntity {
  @Column()
  filename: string;

  @Column()
  url: string;

  @BeforeRemove()
  beforeRemove() {
    rmSync(join(__dirname, '../../uploads', this.filename));
  }
}
