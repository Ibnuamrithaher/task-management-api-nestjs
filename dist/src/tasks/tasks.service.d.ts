import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
export declare class TasksService {
    private tasksRepository;
    constructor(tasksRepository: Repository<Task>);
    create(createTaskDto: CreateTaskDto, user: User): Promise<Task>;
    findAll(user: User): Promise<Task[]>;
    updateStatus(id: string, status: TaskStatus, user: User): Promise<Task>;
    delete(id: string, user: User): Promise<any>;
}
