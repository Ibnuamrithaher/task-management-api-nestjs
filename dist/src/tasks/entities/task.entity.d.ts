import { User } from '../../users/entities/user.entity';
export declare enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}
export declare class Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
