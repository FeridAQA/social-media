import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class SearchUserDto {
  @Type()
  @IsString()
  @ApiProperty()
  @MinLength(1)
  searchParam: string;

  @Type()
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  @Min(0)
  @Max(50)
  limit: number;

  @Type()
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  @Min(0)
  page: number;
}
