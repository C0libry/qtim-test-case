import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../../article/entities/article.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @Column({ unique: true })
  @ApiProperty()
  email: string;

  @Column()
  password: string;

  @Column()
  @ApiProperty()
  username: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Article, (article) => article.author, { onDelete: 'CASCADE' })
  articles: Article[];
}
