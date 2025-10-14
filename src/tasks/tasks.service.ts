import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from 'src/auth/dto/create-task.dto';
import { User } from 'src/auth/user.entity';

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
}