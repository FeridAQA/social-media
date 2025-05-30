import {
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { UserRoles } from 'src/common/enum/user-roles.enum';
// import { AuthGuard } from 'src/guards/auth.guard';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('upload')
@ApiTags('Upload')
// @UseGuards(AuthGuard)
@ApiBearerAuth()
// @Roles(UserRoles.ADMIN, UserRoles.CONTENT_MANAGER)
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
  uploadImage(
    @Req() req: Request,

    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10485760 }),
          new FileTypeValidator({
            fileType: /image\/(jpg|jpeg|png)$/i,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadService.uploadImage(req, file);
  }

  @Delete(':id')
  deleteImage(@Param('id') id: number) {
    return this.uploadService.deleteImage(id);
  }
}
