import { TaskStatus } from '../../tasks/task.entity';
export declare class GetTasksFilterDto {
    status?: TaskStatus;
    search?: string;
}
