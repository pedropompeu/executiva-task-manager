import { Controller, UseGuards, Post, Body, Get, Query, Delete, Param, Patch } from '@nestjs/common'; 
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.entity';
import { Task } from './task.entity'
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.createTask(createTaskDto, user);
  }
  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user);
  }
  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
    }
    @Patch('/:id')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ) {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }

  @Post('/order')
  updateTaskOrder(
    @Body() tasks: { id: string; order: number }[],
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.updateTaskOrder(tasks, user);
  }
}




