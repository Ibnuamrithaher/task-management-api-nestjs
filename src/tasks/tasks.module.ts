// src/tasks/tasks.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service'; // ← Service untuk operasi CRUD task

/**
 * TasksModule
 * 
 * Modul ini menangani semua operasi terkait task.
 * Menggabungkan:
 * - Entity Task dan User untuk akses database
 * - TasksController untuk endpoint API
 * - TasksService untuk logika CRUD task
 * - JwtModule untuk autentikasi request menggunakan JWT
 */
@Module({
  imports: [
    /**
     * TypeOrmModule.forFeature([Task, User])
     * 
     * Menghubungkan entity Task dan User dengan repository TypeORM
     * agar TasksService dan controller bisa mengakses database.
     */
    TypeOrmModule.forFeature([Task, User]),

    /**
     * JwtModule.register({...})
     * 
     * Mengatur JWT dengan secret dari environment variable
     * dan durasi token 3600 detik (1 jam)
     */
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
  ],

  /**
   * controllers: daftar controller yang dikelola modul ini
   */
  controllers: [TasksController],

  /**
   * providers: daftar service yang bisa di-inject ke controller
   */
  providers: [TasksService], // ← TasksService ditambahkan agar bisa digunakan di controller
})
export class TasksModule {}
