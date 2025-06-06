import { Controller, Get, NotFoundException, Param, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { AuthGard } from "src/guards/auth.guard";
import { AuthorizedRequest } from "src/shared/interface/auth.interface";
import { SearchUserDto } from "./dto/search-user.dto";
import { ClsService } from "nestjs-cls";
import { User } from "src/database/entities/User.entity";

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(
        private userService: UserService,
        private cls:ClsService
    ) { }

    @Get('/allUsers')
    getAllUsers() {
        return this.userService.findAll({});
    }


    @Get('/profile')
    @ApiBearerAuth()
    @UseGuards(AuthGard)
    myProfile() {
        let user = this.cls.get<User>('user');
        return this.userService.findOne({where:{ id: user.id }});
    }


    @Get('/profile/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGard)
    async userProfile(@Param('id') id: number) {
        let user = await this.userService.userProfile(id );
        if (!user) throw new NotFoundException();
        return user;
    }



    @Get('search')
    @ApiBearerAuth()
    @UseGuards(AuthGard)
    async search(@Query() query: SearchUserDto) {
        return this.userService.search(query);
    }

}