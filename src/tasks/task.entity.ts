import { User } from '../auth/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum TaskStatus {
  PENDING = 'PENDENTE',
  IN_PROGRESS = 'EM ANDAMENTO',
  DONE = 'CONCLUÍDA',
}

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({
    type: 'varchar',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @Column({ name: 'data_conclusao', type: 'datetime', nullable: true })
  dataConclusao: Date | null;

  @ManyToOne(() => User, user => user.tasks, { eager: false })
  user: User;
}