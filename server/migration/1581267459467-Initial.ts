import { MigrationInterface, QueryRunner } from 'typeorm'

export class Users1581267459467 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TYPE "user_role" AS ENUM('admin', 'user')`)
    await queryRunner.query(`
      CREATE TABLE "users"
      (
        "id"  SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "username" character varying NOT NULL,
        "password" character varying NOT NULL,
        "avatar" character varying,
        "role" "user_role" NOT NULL DEFAULT 'user',
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TYPE "user_role"`)
  }
}
