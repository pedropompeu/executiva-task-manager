// src/auth/user.entity.ts

import { Exclude } from 'class-transformer';
// Adicione OneToMany aqui
import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm'; 
// Importe a entidade Task
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