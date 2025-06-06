import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { CommonEntity } from './Common.entity';
import { User } from './User.entity';

@Entity()
export class Follow extends CommonEntity {
    @Column({ default: false })
    isAccepted: boolean;

    @ManyToOne(()=>User,(user)=>user.followers,{onDelete:'CASCADE'})
    followerUser:User

    @ManyToOne(()=>User,(user)=>user.followeds,{onDelete:'CASCADE'})
    followedUser:User

}
