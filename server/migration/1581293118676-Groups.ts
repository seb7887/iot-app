import { MigrationInterface, QueryRunner } from 'typeorm'

export class Groups1581293118676 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        CREATE TABLE "groups"
        (
          "id" SERIAL NOT NULL PRIMARY KEY,
          "parent_id" SERIAL NOT NULL REFERENCES "groups" ("id") ON DELETE CASCADE,
          "name" character varying NOT NULL
        )
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "groups"`)
  }
}
