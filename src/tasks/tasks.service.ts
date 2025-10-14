import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto } from 'src/auth/dto/create-task.dto';
import { User } from 'src/auth/user.entity';
import { GetTasksFilterDto } from 'src/auth/dto/get-tasks-filter.dto';


@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { titulo, descricao } = createTaskDto;

    const task = this.tasksRepository.create({
      titulo,
      descricao,
      user,
    });

    await this.tasksRepository.save(task);
    return task;
  }
  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Tarefa com ID "${id}" não encontrada.`);
    }
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.tasksRepository.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.titulo) LIKE LOWER(:search) OR LOWER(task.descricao) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }
}