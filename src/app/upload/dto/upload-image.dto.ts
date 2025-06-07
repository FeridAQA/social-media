import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';
import { ApiConsumes, ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({
    format: 'binary',
    name: 'file',
  })
  file: Express.Multer.File;
}