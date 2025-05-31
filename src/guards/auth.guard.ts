import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/user/user.service';

@Injectable()
export class AuthGard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    // private cls: ClsService,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {


    let req = context.switchToHttp().getRequest();

    let token = req.headers.authorization || '';
    token = token.split(' ')[1];

    if (!token) throw new UnauthorizedException();

    try {
      let payload = this.jwtService.verify(token);
      if (!payload.userId) throw new Error();

      let user = this.userService.findone({id: payload.userId});
      if (!user) throw new Error();

      // this.cls.set('user', user);
      // return true;
      req.user = user;
      return true;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException();
    }
  }
}
