import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {}
