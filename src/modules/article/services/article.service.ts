import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { Article } from '../entities/article.entity';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { QueryArticleDto } from '../dto/query-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private logger = new Logger(ArticleService.name);

  private getCacheKey(id: number): string {
    return `article:${id}`;
  }

  private getCacheKeyForList(query: QueryArticleDto): string {
    return `article:${JSON.stringify(query)}`;
  }

  async create(author_id: number, createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articleRepository.create({
      ...createArticleDto,
      author: author_id,
    });
    await this.cacheManager.del('article:*'); // Инвалидируем кэш при создании новой статьи
    return await this.articleRepository.save(article);
  }

  async findAll(query: QueryArticleDto) {
    const cacheKey = this.getCacheKeyForList(query);
    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const { page = 1, limit = 10, author, startDate, endDate, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'user') // Добавляем JOIN с таблицей пользователей
      .select([
        'article.id',
        'article.title',
        'article.description',
        'article.publishDate',
        'article.createdAt',
        'article.updatedAt',
        'user.username',
      ]);

    if (author) {
      queryBuilder.andWhere('user.username LIKE :author', { author: `%${author}%` });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('article.publishDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (search) {
      queryBuilder.andWhere('(article.title LIKE :search OR article.description LIKE :search)', { search: `%${search}%` });
    }

    const [items, total] = await queryBuilder.skip(skip).take(limit).orderBy('article.publishDate', 'DESC').getManyAndCount();

    const result = {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };

    await this.cacheManager.set(cacheKey, result);
    return result;
  }

  async findOne(id: number): Promise<Article> {
    const cacheKey = this.getCacheKey(id);
    const cachedArticle = await this.cacheManager.get<Article>(cacheKey);

    if (cachedArticle) {
      return cachedArticle;
    }

    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }

    await this.cacheManager.set(cacheKey, article);
    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOne(id);
    Object.assign(article, updateArticleDto);

    await this.cacheManager.del(this.getCacheKey(id));
    await this.cacheManager.clear();

    return await this.articleRepository.save(article);
  }

  async remove(id: number): Promise<void> {
    const article = await this.findOne(id);

    await this.cacheManager.del(this.getCacheKey(id));
    await this.cacheManager.clear();

    await this.articleRepository.remove(article);
  }
}
