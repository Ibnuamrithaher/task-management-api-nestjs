import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service'; // ← Service untuk menangani logika autentikasi

/**
 * AuthModule
 * 
 * Modul ini menangani autentikasi dan otorisasi.
 * Menggabungkan controller, service, dan modul JWT/TypeORM yang diperlukan.
 */
@Module({
  imports: [
    /**
     * TypeOrmModule.forFeature([User])
     * 
     * Menghubungkan entity User dengan repository TypeORM
     * sehingga AuthService dapat mengakses tabel users di database.
     */
    TypeOrmModule.forFeature([User]),

    /**
     * JwtModule.register({...})
     * 
     * Mengatur konfigurasi JWT:
     * - secret: kunci rahasia untuk sign token, diambil dari env variable
     * - signOptions.expiresIn: durasi token berlaku (dalam detik)
     */
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' }, // token berlaku 1 jam
    }),
  ],

  /**
   * controllers: daftar controller yang dikelola modul ini
   */
  controllers: [AuthController],

  /**
   * providers: daftar service yang bisa di-inject ke controller
   */
  providers: [AuthService], // ← AuthService ditambahkan agar bisa digunakan di controller
})
export class AuthModule {}
