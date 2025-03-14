import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards, ValidationPipe, HttpStatus, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ArticleService } from '../services/article.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { QueryArticleDto } from '../dto/query-article.dto';
import { Article } from '../entities/article.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator.restapi';
import { ValidatedUser } from 'src/common/interfaces/validatedUser.interface';

/**
 * Контроллер для управления статьями
 * Предоставляет CRUD операции и кэширование
 */
@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * Создание новой статьи
   * @param createArticleDto - Данные для создания статьи
   * @returns Созданная статья
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новую статью' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Статья успешно создана',
    type: Article,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Некорректные данные',
  })
  create(@Body(ValidationPipe) createArticleDto: CreateArticleDto, @CurrentUser() user: ValidatedUser) {
    Logger.warn('create');
    Logger.warn({ user });
    Logger.warn(user.id);
    return this.articleService.create(user.id, createArticleDto);
  }

  /**
   * Получение списка статей с пагинацией и фильтрацией
   * @param query - Параметры запроса (страница, лимит, фильтры)
   * @returns Список статей и метаданные пагинации
   */
  @Get()
  @ApiOperation({ summary: 'Получить список статей' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'author', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список статей успешно получен',
    type: [Article],
  })
  findAll(@Query(ValidationPipe) query: QueryArticleDto) {
    return this.articleService.findAll(query);
  }

  /**
   * Получение статьи по ID
   * @param id - ID статьи
   * @returns Статья
   */
  @Get(':id')
  @ApiOperation({ summary: 'Получить статью по ID' })
  @ApiParam({ name: 'id', description: 'ID статьи' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статья успешно получена',
    type: Article,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Статья не найдена',
  })
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  /**
   * Обновление статьи
   * @param id - ID статьи
   * @param updateArticleDto - Данные для обновления
   * @returns Обновленная статья
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить статью' })
  @ApiParam({ name: 'id', description: 'ID статьи' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статья успешно обновлена',
    type: Article,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Статья не найдена',
  })
  update(@Param('id') id: string, @Body(ValidationPipe) updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  /**
   * Удаление статьи
   * @param id - ID статьи
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить статью' })
  @ApiParam({ name: 'id', description: 'ID статьи' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статья успешно удалена',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Статья не найдена',
  })
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
