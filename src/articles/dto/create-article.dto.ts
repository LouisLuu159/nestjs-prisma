// src/articles/dto/create-article.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ example: 'title' })
  title: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(300)
  @ApiProperty({ required: false, example: 'description' })
  description?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Article body' })
  body: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: false })
  published?: boolean = false;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  @ApiProperty({ example: [{ name: 'Tag6' }] })
  tags?: CreateTagDto[];
}

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ example: 'Tag6' })
  name: string;
}
