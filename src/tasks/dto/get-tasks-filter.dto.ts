import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../../tasks/task.entity';
export class GetTasksFilterDto {
 
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status inválido.' })
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}