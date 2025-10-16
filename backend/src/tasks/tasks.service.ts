import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';


@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { titulo, descricao } = createTaskDto;

    const highestOrderTask = await this.tasksRepository.findOne({
    where: { user: { id: user.id } },
    order: { order: 'DESC' },
  });
    const newOrder = highestOrderTask ? highestOrderTask.order + 1 : 0;

    const task = this.tasksRepository.create({
      titulo,
      descricao,
      user,
      order: newOrder,
    });

    await this.tasksRepository.save(task);
    return task;
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

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user: { id: user.id } } });

    if (!found) {
      throw new NotFoundException(`Tarefa com o ID "${id}" não encontrada.`);
    }

    return found;
  }
  
  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    if (status === TaskStatus.DONE) {
      task.dataConclusao = new Date();
    } else {
      task.dataConclusao = null;
    }

    await this.tasksRepository.save(task);

    return task;
  }

 
  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    const { titulo, descricao } = updateTaskDto;

    if (titulo) {
      task.titulo = titulo;
    }

    if (descricao) {
      task.descricao = descricao;
    }

    await this.tasksRepository.save(task);

    return task;
  }

  async updateTaskOrder(tasks: { id: string; order: number }[], user: User): Promise<void> {
    for (const task of tasks) {
      await this.tasksRepository.update({ id: task.id, user: { id: user.id } }, { order: task.order });
    }
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Tarefa com o ID "${id}" não encontrada.`);
    }
  }
}