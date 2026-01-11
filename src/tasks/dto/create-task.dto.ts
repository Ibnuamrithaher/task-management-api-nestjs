// src/tasks/dto/create-task.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}

export class UpdateTaskStatusDto {
  @IsIn([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE], {
    message: 'Status must be TODO, IN_PROGRESS, or DONE',
  })
  status: TaskStatus;
}