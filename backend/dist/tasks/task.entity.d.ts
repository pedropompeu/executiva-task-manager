import { User } from '../auth/user.entity';
export declare enum TaskStatus {
    PENDING = "PENDENTE",
    IN_PROGRESS = "EM ANDAMENTO",
    DONE = "CONCLU\u00CDDA"
}
export declare class Task {
    id: string;
    titulo: string;
    descricao: string;
    status: TaskStatus;
    dataCriacao: Date;
    dataConclusao: Date | null;
    user: User;
}
