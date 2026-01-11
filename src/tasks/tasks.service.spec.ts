import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

/**
 * Unit test untuk TasksService
 * 
 * Menggunakan Jest untuk:
 * - Mengecek fungsi create task
 * - Mengecek fungsi findAll task
 * - Mengecek fungsi updateStatus task
 * - Mengecek fungsi delete task
 */
describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;

  /**
   * Mock user untuk keperluan test
   */
  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed_password',
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [],
  };

  /**
   * Mock task untuk keperluan test
   */
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
    user: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  /**
   * Setup sebelum setiap test
   * - Membuat testing module
   * - Mock repository Task
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  /**
   * Test untuk fungsi create
   */
  describe('create', () => {
    it('should create and return a new task', async () => {
      jest.spyOn(taskRepository, 'create').mockReturnValue(mockTask);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(mockTask);

      const result = await service.create(
        { title: 'Test Task', description: 'Test Description' },
        mockUser,
      );
      
      expect(result).toEqual(mockTask);
    });
  });

  /**
   * Test untuk fungsi findAll
   */
  describe('findAll', () => {
    it('should return all tasks for a user', async () => {
      const tasks = [mockTask];
      jest.spyOn(taskRepository, 'find').mockResolvedValue(tasks);

      const result = await service.findAll(mockUser);
      
      expect(result).toEqual(tasks);
    });
  });

  /**
   * Test untuk fungsi updateStatus
   */
  describe('updateStatus', () => {
    it('should update task status', async () => {
      const updatedTask = { ...mockTask, status: TaskStatus.IN_PROGRESS };
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(mockTask);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(updatedTask);

      const result = await service.updateStatus('1', TaskStatus.IN_PROGRESS, mockUser);
      
      expect(result).toEqual(updatedTask);
    });
  });

  /**
   * Test untuk fungsi delete
   */
  describe('delete', () => {
    it('should delete a task', async () => {
      const deleteResult = { affected: 1, raw: [] }; // ← TAMBAHKAN raw: []
      jest.spyOn(taskRepository, 'delete').mockResolvedValue(deleteResult);

      const result = await service.delete('1', mockUser);
      
      expect(result).toEqual(deleteResult);
    });
  });
});
