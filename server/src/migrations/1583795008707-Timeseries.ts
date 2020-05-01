import { MigrationInterface, QueryRunner } from 'typeorm'

export class Timeseries1583795008707 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        CREATE TABLE "timeseries"
        (
            "id" UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
            "device_id" UUID NOT NULL REFERENCES "devices"("id") ON DELETE CASCADE,
            "category" character varying NOT NULL,
            "numeric_value" integer,
            "string_value" character varying,
            "time" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP 
        )
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "timeseries"`)
  }
}
