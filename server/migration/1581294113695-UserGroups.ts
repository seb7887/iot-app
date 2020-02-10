import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserGroups1581294113695 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        CREATE TABLE "user_groups"
        (
          "user_id" SERIAL NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
          "group_id" SERIAL NOT NULL REFERENCES "groups" ("id") ON DELETE CASCADE
        )
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "user_groups"`)
  }
}
