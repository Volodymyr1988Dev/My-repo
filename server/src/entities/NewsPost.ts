import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from "typeorm";
import { User } from "./User";
import def from "ajv/dist/vocabularies/discriminator";
import { Genre } from "../enum/enum";


@Entity("news_post")
export class NewsPost {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index()
    header!: string;
    

    @Column()
    text!: string;

    @Column()
    @Index()
    genre!: Genre

    @Column({default: false})
    deleted!: boolean;

    @Column({default : false})
    isPrivate!: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @Index()
    createDate!: Date;

    @ManyToOne(() => User, user => user.posts, { eager: true })
    author!: User;
}   