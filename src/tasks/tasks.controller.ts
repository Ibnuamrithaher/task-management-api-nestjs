import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskStatusDto } from './dto/create-task.dto';

/**
 * TasksController
 * 
 * Controller ini menangani endpoint untuk manajemen task:
 * - Create task
 * - Get all tasks (dengan pagination)
 * - Update task status
 * - Delete task
 * 
 * Setiap request di-authenticate menggunakan JWT.
 */
@Controller('tasks')
export class TasksController {
  /**
   * Constructor
   * @param tasksRepository Repository untuk entity Task
   * @param usersRepository Repository untuk entity User
   * @param jwtService Service untuk verifikasi JWT
   * @param tasksService Service untuk operasi task (CRUD)
   */
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private tasksService: TasksService,
  ) {}

  /**
   * authenticateRequest
   * 
   * Fungsi helper untuk memverifikasi JWT dari request headers
   * Langkah-langkah:
   * 1. Cek apakah header authorization ada dan mulai dengan 'Bearer '
   * 2. Ambil token dari header
   * 3. Verifikasi token menggunakan jwtService
   * 4. Cari user berdasarkan payload token
   * 5. Jika token atau user invalid, lempar UnauthorizedException
   * 
   * @param req Object request dari controller
   * @returns User yang tervalidasi
   */
  private async authenticateRequest(req: any) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }
    const token = authHeader.substring(7);
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException('Invalid user');
      return user;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * POST /tasks
   * 
   * Endpoint untuk membuat task baru.
   * Menggunakan ValidationPipe untuk validasi input DTO:
   * - transform: otomatis ubah body menjadi instance DTO
   * - whitelist: hapus properti yang tidak ada di DTO
   * - forbidNonWhitelisted: lempar error jika ada properti tidak dikenal
   * 
   * @param createTaskDto Data input task baru
   * @param req Request object (digunakan untuk autentikasi)
   * @returns Task yang dibuat dengan field id, title, status, created_at
   */
  @Post()
  @UsePipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true,
    forbidNonWhitelisted: true 
  }))
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const user = await this.authenticateRequest(req);
    const task = await this.tasksService.create(createTaskDto, user);
    const { id, title, status, createdAt } = task;
    return { id, title, status, created_at: createdAt };
  }

  /**
   * GET /tasks
   * 
   * Endpoint untuk mengambil semua task user dengan pagination.
   * Default page = 1, limit = 10, maksimal limit = 100.
   * 
   * @param req Request object (untuk autentikasi)
   * @param page Query parameter halaman
   * @param limit Query parameter jumlah data per halaman
   * @returns Object berisi data tasks dan meta informasi pagination
   */
  @Get()
  async findAll(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const user = await this.authenticateRequest(req);
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const take = Math.min(limitNumber, 100);
    const skip = (pageNumber - 1) * take;

    const [tasks, total] = await this.tasksRepository.findAndCount({
      where: { user: { id: user.id } },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: tasks.map(({ id, title, status, createdAt }) => ({
        id,
        title,
        status,
        created_at: createdAt,
      })),
      meta: {
        total,
        page: pageNumber,
        per_page: take,
        last_page: Math.ceil(total / take),
      },
    };
  }

  /**
   * PATCH /tasks/:id
   * 
   * Endpoint untuk mengubah status task.
   * Menggunakan ValidationPipe untuk validasi input DTO.
   * @param id ID task (UUID) yang akan diupdate
   * @param updateDto DTO berisi status baru
   * @param req Request object (untuk autentikasi)
   * @returns Task yang diupdate dengan field id dan status
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true,
    forbidNonWhitelisted: true 
  }))
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateDto: UpdateTaskStatusDto, 
    @Request() req
  ) {
    const user = await this.authenticateRequest(req);
    const task = await this.tasksService.updateStatus(id, updateDto.status, user);
    return { id: task.id, status: task.status };
  }

  /**
   * DELETE /tasks/:id
   * 
   * Endpoint untuk menghapus task.
   * @param id ID task (UUID) yang akan dihapus
   * @param req Request object (untuk autentikasi)
   * @returns Pesan sukses jika task berhasil dihapus
   */
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const user = await this.authenticateRequest(req);
    await this.tasksService.delete(id, user);
    return { message: 'Task deleted' };
  }
}
