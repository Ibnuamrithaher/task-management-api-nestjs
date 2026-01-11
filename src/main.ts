// src/main.ts

import './config/env'; // Memuat environment variables dari file konfigurasi
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
/**
 * bootstrap
 * 
 * Fungsi utama untuk memulai aplikasi NestJS.
 * Langkah-langkah:
 * 1. Membuat instance aplikasi dari AppModule
 * 2. Mengaktifkan global validation pipe untuk validasi DTO
 * 3. Menjalankan server pada port dari environment variable atau default 3000
 */
async function bootstrap() {
  // Membuat aplikasi NestJS dari AppModule
  const app = await NestFactory.create(AppModule);
  // Gunakan ValidationPipe secara global untuk semua request
  // - Memvalidasi semua DTO
  // - Menghapus properti yang tidak ada di DTO secara otomatis (whitelist default false)
  app.useGlobalPipes(new ValidationPipe());

  // Jalankan server pada port environment variable atau default 3000
  await app.listen(process.env.PORT ?? 3000);
}

// Menjalankan bootstrap untuk memulai aplikasi
bootstrap();
