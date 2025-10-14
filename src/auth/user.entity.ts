import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, Unique} from 'typeorm';

@Entity({name: 'users'})
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false,type: 'varchar', length: 200})
    email: string;

    @Exclude()
    @Column({nullable: false,type: 'varchar', length: 200})
    password: string;
}