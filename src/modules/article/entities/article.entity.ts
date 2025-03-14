import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/entities/user.entity';

/**
 * Сущность статьи
 * @example
 * {
 *   "id": 1,
 *   "title": "Заголовок статьи",
 *   "description": "Описание статьи",
 *   "author": "Иван Иванов",
 *   "publishDate": "2024-03-20T12:00:00Z",
 *   "createdAt": "2024-03-20T12:00:00Z",
 *   "updatedAt": "2024-03-20T12:00:00Z"
 * }
 */
@Entity('article')
export class Article {
  @ApiProperty({
    description: 'Уникальный идентификатор статьи',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Заголовок статьи',
    example: 'Заголовок статьи',
    minLength: 3,
    maxLength: 100,
  })
  @Column({ length: 100 })
  title: string;

  @ApiProperty({
    description: 'Описание статьи',
    example: 'Подробное описание статьи',
    minLength: 10,
    maxLength: 1000,
  })
  @Column({ length: 1000 })
  description: string;

  @ApiProperty({
    description: 'Дата публикации статьи',
    example: '2024-03-20T12:00:00Z',
  })
  @CreateDateColumn()
  @Column({ name: 'publish_date' })
  publishDate: Date;

  @ApiProperty({
    description: 'Дата создания записи',
    example: '2024-03-20T12:00:00Z',
  })
  @CreateDateColumn()
  @Column({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2024-03-20T12:00:00Z',
  })
  @UpdateDateColumn()
  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Id автора',
    example: 1,
    minimum: 1,
  })
  @Column({ name: 'author_id' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: number;
}
