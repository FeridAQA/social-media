import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/database/entities/User.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { FollowModule } from "../follow/follow.module";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User]),FollowModule], // Add your entities here
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})

export class UserModule {}