import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'Заголовок статьи' })
  @IsNotEmpty({ message: 'Название статьи обязательно' })
  @IsString()
  @MinLength(3, { message: 'Название должно быть не менее 3 символов' })
  @MaxLength(100, { message: 'Название должно быть не более 100 символов' })
  title: string;

  @ApiProperty({ example: 'Описание статьи' })
  @IsNotEmpty({ message: 'Описание статьи обязательно' })
  @IsString()
  @MinLength(10, { message: 'Описание должно быть не менее 10 символов' })
  description: string;

  // @ApiProperty({ example: 'Иван Иванов' })
  // @IsNotEmpty({ message: 'Имя автора обязательно' })
  // @IsString()
  // @MinLength(2, { message: 'Имя автора должно быть не менее 2 символов' })
  // author: string;
}
