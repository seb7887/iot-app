import { MigrationInterface, QueryRunner } from 'typeorm'

export class Users1581267459467 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
    await queryRunner.query(`
        CREATE TABLE "groups"
        (
          "id" UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
          "parent_id" UUID REFERENCES "groups" ("id") ON DELETE CASCADE,
          "name" character varying NOT NULL,
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `)
    await queryRunner.query(`CREATE TYPE "user_role" AS ENUM('admin', 'user')`)
    await queryRunner.query(`
      CREATE TABLE "users"
      (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        "email" character varying NOT NULL UNIQUE,
        "username" character varying NOT NULL,
        "password" character varying NOT NULL,
        "group_id" UUID REFERENCES "groups" ("id") ON DELETE CASCADE,
        "avatar" character varying,
        "role" "user_role" NOT NULL DEFAULT 'user',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TYPE "user_role"`)
    await queryRunner.query(`DROP TABLE "groups"`)
  }
}
