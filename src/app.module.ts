import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/config';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { UploadModule } from './app/upload/upload.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ClsGuard, ClsModule } from 'nestjs-cls';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [
    // env consifg
    ConfigModule.forRoot(),

    // database module
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.user,
      password: config.database.password,
      database: config.database.database,
      entities: [`${__dirname}*/**/*.entity{.ts,.js}`],
      migrations: [`${__dirname}*/**/migrations/*{.ts,.js}`],
      synchronize: true,
      logging: true,
    }),

    // jwt module
    JwtModule.register({
      global: true,
      secret: config.jwtSecret,
      signOptions: { expiresIn: '10d' },
    }),


    // smtp

    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: "afe681a2@gmail.com",
          pass: "wdxouhbkahubarjn",
        },
      },
      defaults: {
        from: config.smtp.from,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),

    // cls 
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      guard:{mount: true},
    }),

    // user module
    UserModule,
    // auth module
    AuthModule,

    // upload module
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService,
     {
            provide: APP_GUARD,
            useClass: ClsGuard,
        },
  ],
})
export class AppModule { }
