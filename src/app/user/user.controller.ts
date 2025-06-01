import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { AuthGard } from "src/guards/auth.guard";
import { AuthorizedRequest } from "src/shared/interface/auth.interface";

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(private userService:UserService) { }

    @Get('/allUsers')
    getAllUsers() {
        return this.userService.findone({});    
    }


    @Get('/profile')
    @ApiBearerAuth()
    @UseGuards(AuthGard)
    myProfile(@Req() req:AuthorizedRequest) {
        return this.userService.findone({ id: req.user.id });
    }
}