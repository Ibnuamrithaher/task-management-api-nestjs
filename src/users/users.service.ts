// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

/**
 * UsersService
 * 
 * Service ini menangani semua logika terkait user:
 * - Membuat user baru dengan password yang di-hash
 * - Mencari user berdasarkan email
 * - Mencari user berdasarkan ID
 */
@Injectable()
export class UsersService {
  /**
   * Constructor
   * @param usersRepository Repository untuk entity User
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * create
   * 
   * Membuat user baru.
   * Langkah-langkah:
   * 1. Generate salt menggunakan bcrypt
   * 2. Hash password
   * 3. Buat entity user baru
   * 4. Simpan ke database
   * 
   * @param name Nama user
   * @param email Email user
   * @param password Password user (plain text, akan di-hash)
   * @returns User yang baru dibuat
   */
  async create(name: string, email: string, password: string): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.usersRepository.create({ name, email, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  /**
   * findByEmail
   * 
   * Mencari user berdasarkan email.
   * @param email Email user yang dicari
   * @returns User jika ditemukan, atau undefined jika tidak ada
   */
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * findById
   * 
   * Mencari user berdasarkan ID.
   * @param id ID user yang dicari
   * @returns User jika ditemukan, atau undefined jika tidak ada
   */
  async findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
