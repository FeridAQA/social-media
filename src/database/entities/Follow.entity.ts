import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { CommonEntity } from './Common.entity';
import { User } from './User.entity';
import { FollowStatus } from 'src/shared/enum/follow.enum';

@Entity()
export class Follow extends CommonEntity {
    @Column({ default: FollowStatus.WAITING })
    status: FollowStatus;

    @ManyToOne(()=>User,(user)=>user.myFollowers,{onDelete:'CASCADE'})
    follower:User

    @ManyToOne(()=>User,(user)=>user.iFolloweds,{onDelete:'CASCADE'})
    followed:User

}
