import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

/**
 * AuthService
 * 
 * Service ini menangani semua logika terkait autentikasi:
 * - Registrasi user baru (register)
 * - Login user dan pembuatan JWT (login)
 */
@Injectable()
export class AuthService {
  /**
   * Constructor
   * @param usersRepository Repository untuk entity User
   * @param jwtService Service untuk membuat dan menandatangani JWT
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * register
   * 
   * Fungsi untuk mendaftarkan user baru.
   * Langkah-langkah:
   * 1. Cek apakah email sudah ada di database.
   * 2. Jika ada, lempar UnauthorizedException.
   * 3. Hash password menggunakan bcrypt.
   * 4. Buat entity user baru.
   * 5. Simpan user ke database.
   * 6. Kembalikan pesan sukses.
   * 
   * @param registerDto Data input registrasi (name, email, password)
   * @returns Pesan sukses jika berhasil register
   */
  async register(registerDto: RegisterDto) {
    // cek email sudah ada
    const existing = await this.usersRepository.findOne({ 
      where: { email: registerDto.email } 
    });
    if (existing) {
      throw new UnauthorizedException('Email already exists');
    }
    
    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    // buat user baru
    const user = this.usersRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });

    // simpan user ke database
    await this.usersRepository.save(user);

    return { message: 'User registered successfully' };
  }

  /**
   * login
   * 
   * Fungsi untuk login user.
   * Langkah-langkah:
   * 1. Cari user berdasarkan email.
   * 2. Jika tidak ditemukan, lempar UnauthorizedException.
   * 3. Bandingkan password dengan bcrypt.
   * 4. Jika password salah, lempar UnauthorizedException.
   * 5. Buat payload JWT (email dan id user).
   * 6. Kembalikan access token.
   * 
   * @param loginDto Data input login (email, password)
   * @returns Object dengan access_token JWT
   */
  async login(loginDto: LoginDto) {
    // cari user berdasarkan email
    const user = await this.usersRepository.findOne({ 
      where: { email: loginDto.email } 
    });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // cek password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // buat payload JWT
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
