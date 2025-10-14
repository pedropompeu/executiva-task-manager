import { Controller, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Controller('tasks')
@UseGuards(AuthGuard())

export class TasksController {
    @Get()
    getTasksTest(): string {
        return 'Rota de tarefa protegida';
    }
}