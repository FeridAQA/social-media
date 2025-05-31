// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { ClsService } from 'nestjs-cls';
// import { Observable } from 'rxjs';
// import { UserService } from 'src/app/user/user.service';
// import { User } from 'src/database/entities/User.entity';
// import { FollowStatus } from 'src/shared/enum/follow.enum';
// import { FindOptionsSelect } from 'typeorm';

// @Injectable()
// export class ProfileGuard implements CanActivate {
//   constructor(
//     private userService: UserService,
//     private cls: ClsService,
//   ) {}

//   async canActivate(context: ExecutionContext) {
//     let req = context.switchToHttp().getRequest();

//     let userId = Number(req.params.userId || req.query.userId);
//     if (!userId) throw new NotFoundException('User is not found');

//     const myUser = await this.cls.get<User>('user');
//     if (myUser.id === userId) return true;

//     let user = await this.userService.findOne({
//       where: [
//         { id: userId, isPrivate: false },
//         {
//           id: userId,
//           myFollowers: {
//             status: FollowStatus.FOLLOWING,
//             followed: { id: myUser.id },
//           },
//         },
//       ],
//       select: { id: true },
//       relations: ['myFollowers', 'myFollowers.followed'],
//     });
//     if (!user) return false;
//     return true;
//   }
// }
