import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import def from "ajv/dist/vocabularies/discriminator";
import { Genre } from "../enum/enum";


@Entity("news_post")
export class NewsPost {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    text!: string;

    @Column()
    genre!: Genre

    @Column({default : false})
    isPrivate!: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createDate!: Date;

    @ManyToOne(() => User, user => user.posts, { eager: true })
    author!: User;
}   