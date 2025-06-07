import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { extname } from 'path';

@Controller('upload')
@ApiTags('Upload')
@ApiBearerAuth()
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10485760 }),  // Maksimum ölçü 10MB
          // new FileTypeValidator({
          //   fileType: /image\/(jpg|jpeg|png)$/i,
          // }),
        ],
      }),
    ) file: Express.Multer.File,
  ) {


     const validTypes = ['.jpg', '.jpeg', '.png'];
    const ext = extname(file.originalname).toLowerCase();

    if (!validTypes.includes(ext)) {
      console.log('Yanlış fayl tipi:', ext);
      throw new BadRequestException('Yanlış fayl tipi! Yalnız .jpg, .jpeg və .png faylları qəbul edilir.');
    }


    return this.uploadService.uploadImage(req, file);
  }

  @Delete(':id')
  deleteImage(@Param('id') id: number) {
    return this.uploadService.deleteImage(id);
  }
}
