import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/config';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { UploadModule } from './app/upload/upload.module';
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


    // user module
    UserModule,
    // auth module
    AuthModule,

    // upload module
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
