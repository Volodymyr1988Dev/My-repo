import { MigrationInterface, QueryRunner } from "typeorm";

export class Action1758212915820 implements MigrationInterface {
    name = 'Action1758212915820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_post" ADD "genre" character varying NOT NULL DEFAULT 'Other'`);
        await queryRunner.query(`ALTER TABLE "news_post" ADD "isPrivate" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "news_post" ADD "createDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_df3979bad92d26bcf72e480ad7" ON "news_post" ("genre") `);
        await queryRunner.query(`CREATE INDEX "IDX_694170ebc0718ad5420f4192a1" ON "news_post" ("createDate") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_694170ebc0718ad5420f4192a1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df3979bad92d26bcf72e480ad7"`);
        await queryRunner.query(`ALTER TABLE "news_post" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "news_post" DROP COLUMN "isPrivate"`);
        await queryRunner.query(`ALTER TABLE "news_post" DROP COLUMN "genre"`);
    }

}
