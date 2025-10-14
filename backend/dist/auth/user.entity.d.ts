import { Task } from '../tasks/task.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    tasks: Task[];
}
