import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { NewsPost } from "./NewsPost";


@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
   // primary: true;
   // generated: true;
    id!: number;

    @Column({ unique: true, length: 20 })
    email!: string;

    @Column({ type: 'varchar', length: 255 })
    passwordHash!: string;


    @OneToMany(() => NewsPost, post => post.author)
    posts!: NewsPost[];
}