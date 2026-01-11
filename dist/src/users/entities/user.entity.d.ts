import { Task } from '../../tasks/entities/task.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    tasks: Task[];
    createdAt: Date;
    updatedAt: Date;
}
