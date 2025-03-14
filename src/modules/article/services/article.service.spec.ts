import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ArticleService } from './article.service';
import { Article } from '../entities/article.entity';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { QueryArticleDto } from '../dto/query-article.dto';
import { NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('ArticleService', () => {
  let service: ArticleService;
  let repository: Repository<Article>;
  let cacheManager: Cache;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    repository = module.get<Repository<Article>>(getRepositoryToken(Article));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new article', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'Test Article',
        description: 'Test Description',
        author: 'Test Author',
      };

      const article = { id: 1, ...createArticleDto, publishDate: new Date() };
      mockRepository.create.mockReturnValue(article);
      mockRepository.save.mockResolvedValue(article);

      const result = await service.create(createArticleDto);

      expect(result).toEqual(article);
      expect(mockRepository.create).toHaveBeenCalledWith(createArticleDto);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(cacheManager.clear).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return articles from cache if available', async () => {
      const cachedData = { items: [], total: 0, page: 1, totalPages: 0 };
      mockCacheManager.get.mockResolvedValue(cachedData);

      const result = await service.findAll({});

      expect(result).toEqual(cachedData);
      expect(mockCacheManager.get).toHaveBeenCalled();
      expect(mockRepository.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('should return articles from database if not in cache', async () => {
      const query: QueryArticleDto = { page: 1, limit: 10 };
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.createQueryBuilder().getManyAndCount.mockResolvedValue([[], 0]);

      const result = await service.findAll(query);

      expect(result).toBeDefined();
      expect(mockCacheManager.set).toHaveBeenCalled();
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return article from cache if available', async () => {
      const cachedArticle = { id: 1, title: 'Test' };
      mockCacheManager.get.mockResolvedValue(cachedArticle);

      const result = await service.findOne(1);

      expect(result).toEqual(cachedArticle);
      expect(mockCacheManager.get).toHaveBeenCalled();
      expect(mockRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return article from database if not in cache', async () => {
      const article = { id: 1, title: 'Test' };
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findOne.mockResolvedValue(article);

      const result = await service.findOne(1);

      expect(result).toEqual(article);
      expect(mockCacheManager.set).toHaveBeenCalled();
      expect(mockRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if article not found', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an article', async () => {
      const updateArticleDto: UpdateArticleDto = {
        title: 'Updated Title',
      };

      const existingArticle = { id: 1, title: 'Old Title' };
      const updatedArticle = { ...existingArticle, ...updateArticleDto };

      mockRepository.findOne.mockResolvedValue(existingArticle);
      mockRepository.save.mockResolvedValue(updatedArticle);

      const result = await service.update(1, updateArticleDto);

      expect(result).toEqual(updatedArticle);
      expect(mockCacheManager.del).toHaveBeenCalled();
      expect(mockCacheManager.reset).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an article', async () => {
      const article = { id: 1, title: 'Test' };
      mockRepository.findOne.mockResolvedValue(article);
      mockRepository.remove.mockResolvedValue(article);

      await service.remove(1);

      expect(mockCacheManager.del).toHaveBeenCalled();
      expect(mockCacheManager.reset).toHaveBeenCalled();
      expect(mockRepository.remove).toHaveBeenCalledWith(article);
    });
  });
}); 