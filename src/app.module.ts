import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/config';
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
    })

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
