import { Column, Entity } from 'typeorm';
import { CommonEntity } from './Common.entity';

@Entity()
export class Follow extends CommonEntity {
    @Column()
    followerId: number;
    
    @Column()
    followedId: number;
    
    @Column({ default: false })
    isAccepted: boolean;

}
