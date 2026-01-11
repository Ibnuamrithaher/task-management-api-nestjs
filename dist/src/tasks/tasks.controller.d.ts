import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskStatusDto } from './dto/create-task.dto';
export declare class TasksController {
    private tasksRepository;
    private usersRepository;
    private jwtService;
    private tasksService;
    constructor(tasksRepository: Repository<Task>, usersRepository: Repository<User>, jwtService: JwtService, tasksService: TasksService);
    private authenticateRequest;
    create(createTaskDto: CreateTaskDto, req: any): Promise<{
        id: string;
        title: string;
        status: TaskStatus;
        created_at: Date;
    }>;
    findAll(req: any, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            title: string;
            status: TaskStatus;
            created_at: Date;
        }[];
        meta: {
            total: number;
            page: number;
            per_page: number;
            last_page: number;
        };
    }>;
    updateStatus(id: string, updateDto: UpdateTaskStatusDto, req: any): Promise<{
        id: string;
        status: TaskStatus;
    }>;
    delete(id: string, req: any): Promise<{
        message: string;
    }>;
}
