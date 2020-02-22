import { MigrationInterface, QueryRunner } from 'typeorm'

export class Devices1581294310140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        CREATE TABLE "devices"
        (
          "id" UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
          "group_id" UUID NOT NULL REFERENCES "groups" ("id") ON DELETE CASCADE,
          "serial" character varying NOT NULL UNIQUE,
          "password" character varying NOT NULL,
          "connected" BOOL NOT NULL DEFAULT false,
          "properties" JSONB NOT NULL,
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "devices"`)
  }
}
