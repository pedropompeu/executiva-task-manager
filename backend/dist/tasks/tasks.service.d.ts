import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private tasksRepository;
    constructor(tasksRepository: Repository<Task>);
    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>;
    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>;
    getTaskById(id: string, user: User): Promise<Task>;
    updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task>;
    updateTask(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task>;
    updateTaskOrder(tasks: {
        id: string;
        order: number;
    }[], user: User): Promise<void>;
    deleteTask(id: string, user: User): Promise<void>;
}
