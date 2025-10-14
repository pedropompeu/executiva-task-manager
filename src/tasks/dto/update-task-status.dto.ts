import { IsEnum } from 'class-validator';
import { TaskStatus } from '../../tasks/task.entity';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus, { message: `Status inválido. Os valores válidos são: ${Object.values(TaskStatus).join(', ')}` })
  status: TaskStatus;
}