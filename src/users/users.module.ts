// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

/**
 * UsersModule
 * 
 * Modul ini menangani semua operasi terkait user.
 * Menggabungkan:
 * - Entity User untuk akses database
 * - UsersService untuk logika CRUD user
 * 
 * Modul ini juga mengekspor UsersService agar bisa digunakan di module lain,
 * misal di AuthModule untuk register dan login.
 */
@Module({
  imports: [
    /**
     * TypeOrmModule.forFeature([User])
     * 
     * Menghubungkan entity User dengan repository TypeORM
     * agar UsersService bisa mengakses tabel users di database.
     */
    TypeOrmModule.forFeature([User]), // ← INI WAJIB!
  ],
  /**
   * providers: daftar service yang bisa di-inject ke controller atau module lain
   */
  providers: [UsersService],

  /**
   * exports: service yang diekspor agar bisa dipakai di module lain
   */
  exports: [UsersService], // penting jika dipakai di module lain (misal: AuthModule)
})
export class UsersModule {}
