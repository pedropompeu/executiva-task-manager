import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm'; 
import { Task } from '../tasks/task.entity'; 

@Entity({ name: 'users' })
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  email: string;
  
  @Exclude()
  @Column({ nullable: false, type: 'varchar', select: false })
  password: string;

  @OneToMany(() => Task, task => task.user, { eager: true })
  tasks: Task[];
}