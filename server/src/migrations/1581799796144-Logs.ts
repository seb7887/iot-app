import { MigrationInterface, QueryRunner } from 'typeorm'

export class Logs1581799796144 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        CREATE TABLE "logs"
        (
            "id" UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
            "device_id" UUID NOT NULL REFERENCES "devices" ("id"),
            "connected" BOOL NOT NULL DEFAULT false,
            "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP 
        )
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "logs"`)
  }
}
