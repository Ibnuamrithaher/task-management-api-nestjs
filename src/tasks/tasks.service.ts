import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';

/**
 * TasksService
 * 
 * Service ini menangani semua logika CRUD untuk task:
 * - create task
 * - find tasks milik user
 * - update status task
 * - delete task
 */
@Injectable()
export class TasksService {
  /**
   * Constructor
   * @param tasksRepository Repository untuk entity Task
   */
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  /**
   * create
   * 
   * Fungsi untuk membuat task baru.
   * Langkah-langkah:
   * 1. Buat entity task baru dari DTO
   * 2. Set status default TaskStatus.TODO
   * 3. Assign task ke user yang membuatnya
   * 4. Simpan task ke database
   * 
   * @param createTaskDto DTO berisi data task baru
   * @param user User yang membuat task
   * @returns Task yang baru dibuat
   */
  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      status: TaskStatus.TODO,
      user,
    });
    return this.tasksRepository.save(task);
  }

  /**
   * findAll
   * 
   * Mengambil semua task milik user tertentu
   * 
   * @param user User pemilik task
   * @returns Array task milik user
   */
  async findAll(user: User): Promise<Task[]> {
    return this.tasksRepository.find({ where: { user: { id: user.id } } });
  }

  /**
   * updateStatus
   * 
   * Mengubah status task milik user tertentu.
   * Langkah-langkah:
   * 1. Cari task berdasarkan id dan user
   * 2. Jika tidak ditemukan, lempar error
   * 3. Update status task
   * 4. Simpan task ke database
   * 
   * @param id ID task yang akan diupdate
   * @param status Status baru task
   * @param user User pemilik task
   * @returns Task yang telah diupdate
   */
  async updateStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ 
      where: { id, user: { id: user.id } } 
    });
    if (!task) {
      throw new Error('Task not found');
    }
    task.status = status;
    return this.tasksRepository.save(task);
  }

  /**
   * delete
   * 
   * Menghapus task milik user tertentu
   * 
   * @param id ID task yang akan dihapus
   * @param user User pemilik task
   * @returns Hasil delete repository
   */
  async delete(id: string, user: User): Promise<any> {
    return this.tasksRepository.delete({ 
      id, 
      user: { id: user.id } 
    });
  }
}
