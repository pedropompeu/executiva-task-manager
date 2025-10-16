import { User } from '../auth/user.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>;
    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>;
    deleteTask(id: string, user: User): Promise<void>;
    updateTask(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task>;
    updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto, user: User): Promise<Task>;
    updateTaskOrder(tasks: {
        id: string;
        order: number;
    }[], user: User): Promise<void>;
}
