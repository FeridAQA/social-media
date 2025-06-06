import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CommonEntity } from "./Common.entity";
import { UserGender, UserRole } from "src/shared/enum/user.enum";
import { ImageEntity } from "./Image.entity";

import * as bcrypt from 'bcrypt'

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
    profilePicture: ImageEntity;


    @Column()
    birthDate: Date;

    @Column({
        type: "enum",
        enum: UserGender,
    })
    gender: UserGender;

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