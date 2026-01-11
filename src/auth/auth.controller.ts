import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

/**
 * AuthController
 * 
 * Controller untuk menangani endpoint autentikasi:
 * - /auth/register  -> Mendaftarkan user baru
 * - /auth/login     -> Login user dan mengembalikan token
 */
@Controller('auth')
export class AuthController {
  /**
   * Constructor untuk inject AuthService
   * @param authService Service yang menangani logika autentikasi
   */
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/register
   * 
   * Endpoint untuk registrasi user baru.
   * Menggunakan ValidationPipe untuk:
   * - transform: otomatis mengubah payload menjadi DTO
   * - whitelist: menghapus properti yang tidak ada di DTO
   * 
   * @param registerDto Data dari body request untuk registrasi user
   * @returns Hasil register dari AuthService
   */
  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * POST /auth/login
   * 
   * Endpoint untuk login user.
   * Menggunakan ValidationPipe dengan konfigurasi sama seperti register:
   * - transform: otomatis mengubah payload menjadi DTO
   * - whitelist: menghapus properti yang tidak ada di DTO
   * 
   * @param loginDto Data dari body request untuk login
   * @returns Hasil login dari AuthService (misal: token JWT)
   */
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
