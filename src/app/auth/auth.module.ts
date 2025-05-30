import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import config from 'src/config/config';

@Module({
  imports: [UserModule,
    // jwt module
    JwtModule.register({
      global: true,
      secret: config.jwtSecret,
      signOptions: { expiresIn: '10d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
