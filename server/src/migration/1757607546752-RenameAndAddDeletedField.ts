import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameAndAddDeletedField1757607546752 implements MigrationInterface {
    name = 'RenameAndAddDeletedField1757607546752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_post" DROP COLUMN "genre"`);
        await queryRunner.query(`ALTER TABLE "news_post" DROP COLUMN "isPrivate"`);
        await queryRunner.query(`ALTER TABLE "news_post" DROP COLUMN "createDate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_post" ADD "createDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "news_post" ADD "isPrivate" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "news_post" ADD "genre" character varying NOT NULL`);
    }

}
