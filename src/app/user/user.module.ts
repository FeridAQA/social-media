import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Type } from "class-transformer";
import { User } from "src/database/entities/User.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
    imports: [TypeOrmModule.forFeature([User])], // Add your entities here
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})

export class UserModule {}