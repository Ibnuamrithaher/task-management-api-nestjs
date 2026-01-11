import { TaskStatus } from '../entities/task.entity';
export declare class CreateTaskDto {
    title: string;
    description?: string;
}
export declare class UpdateTaskStatusDto {
    status: TaskStatus;
}
