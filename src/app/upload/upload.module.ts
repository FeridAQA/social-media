import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { ImageEntity } from 'src/database/entities/Image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageEntity]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../../uploads'),
        filename: (req, file, callback) => {
          callback(
            null,
            `${Date.now()}${extname(file.originalname).toLowerCase()}`,
          );
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}