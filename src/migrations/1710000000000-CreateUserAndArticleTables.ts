import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndArticleTables1710000000000 implements MigrationInterface {
  name = 'CreateUserAndArticleTables1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание таблицы пользователей
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "email" VARCHAR NOT NULL UNIQUE,
                "password" VARCHAR NOT NULL,
                "username" VARCHAR NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

    // Создание таблицы статей
    await queryRunner.query(`
            CREATE TABLE "article" (
                "id" SERIAL PRIMARY KEY,
                "title" VARCHAR NOT NULL,
                "description" TEXT NOT NULL,
                "author_id" INTEGER NOT NULL,
                "publish_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_article_user" FOREIGN KEY ("author_id") 
                REFERENCES "user"("id") ON DELETE CASCADE
            )
        `);

    // Создание индексов
    await queryRunner.query(`
            CREATE INDEX "IDX_article_publish_date" ON "article" ("publish_date");
            CREATE INDEX "IDX_article_author_id" ON "article" ("author_id");
            CREATE INDEX "IDX_user_email" ON "user" ("email");
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаление индексов
    await queryRunner.query(`DROP INDEX "IDX_article_publish_date"`);
    await queryRunner.query(`DROP INDEX "IDX_article_author_id"`);
    await queryRunner.query(`DROP INDEX "IDX_user_email"`);

    // Удаление таблиц
    await queryRunner.query(`DROP TABLE "article"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
