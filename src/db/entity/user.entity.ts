import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn()
    username: string;

    @Column()
    password: string;

    @PrimaryColumn()
    telegramUserID: string;
}