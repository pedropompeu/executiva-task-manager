import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task.entity';

export class UpdateTaskStatusDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}