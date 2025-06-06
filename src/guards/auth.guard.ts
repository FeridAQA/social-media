import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClsService } from 'nestjs-cls';
// import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/user/user.service';

@Injectable()
@Injectable()
export class AuthGard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private cls: ClsService,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const req = context.switchToHttp().getRequest();
    let token = req.headers.authorization || '';
    token = token.split(' ')[1];

    if (!token) throw new UnauthorizedException();

    try {
      const payload = this.jwtService.verify(token);

      if (!payload.userId) throw new Error('No userId in token');

      let user = await this.userService.findOne({ id: payload.userId });

      if (!user) throw new Error('User not found');

      this.cls.set('user', user);
      return true;
    } catch (err) {
      console.log('AuthGuard error:', err);
      throw new UnauthorizedException();
    }
  }
}

