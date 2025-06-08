import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CommonEntity } from "./Common.entity";
import { UserGender, UserRole } from "src/shared/enum/user.enum";
import { ImageEntity } from "./Image.entity";

import * as bcrypt from 'bcrypt'
import { Follow } from "./Follow.entity";
import { PostEntity } from "./Post.entity";
import { ChatParticipant } from "./ChatParticipant.entity";

@Entity()
export class User extends CommonEntity {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    userName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true, })
    bio: string;


    @Column({ default: 0 })
    followerCount: number;

    @Column({ default: 0 })
    followedCount: number;

    @Column({ default: false })
    isPrivate: boolean;

    @OneToOne(() => ImageEntity, { eager: true, nullable: true })
    @JoinColumn()
    profilePicture: Partial<ImageEntity>;


    @Column()
    birthDate: Date;

    @Column({
        type: "enum",
        enum: UserGender,
    })
    gender: UserGender;



    @OneToMany(() => PostEntity, (post) => post.user)
    posts: PostEntity[];



    @OneToMany(() => Follow, (follow) => follow.followed)
    iFolloweds: Follow[] // özünün elədikləri

    @OneToMany(() => Follow, (follow) => follow.follower)
    myFollowers: Follow[] // onu eliyənlər


    @OneToMany(() => ChatParticipant, (chatParticipant) => chatParticipant.user)
    chatParticipants: ChatParticipant[];


    @Column({ nullable: true })
    activationToken: string;

    @Column({ nullable: true })
    activationExpire: Date;


    @Column({
        type: 'enum',
        enum: UserRole,
        array: true,
    })
    roles: UserRole[];




    // Hash password before saving to the database
    @BeforeInsert()
    beforeInsert() {
        this.password = bcrypt.hashSync(this.password, 10);
    }


    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }


}