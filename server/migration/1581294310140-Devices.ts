import { MigrationInterface, QueryRunner } from 'typeorm'

export class Devices1581294310140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        CREATE TABLE "devices"
        (
          "id" SERIAL NOT NULL PRIMARY KEY,
          "group_id" SERIAL NOT NULL REFERENCES "groups" ("id") ON DELETE CASCADE,
          "serial" character varying NOT NULL UNIQUE,
          "client_id" character varying NOT NULL,
          "password" character varying NOT NULL,
          "connected" BOOL NOT NULL DEFAULT false,
          "properties" JSONB NOT NULL
        )
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "devices"`)
  }
}
