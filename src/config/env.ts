// src/config/env.ts
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Muat .env hanya jika file ada
if (fs.existsSync('.env')) {
  dotenv.config();
}