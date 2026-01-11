import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('docs')
  getDocumentation(@Res() res: Response) {
    const docsPath = path.join(process.cwd(), 'public', 'docs.html');
    return res.sendFile(docsPath);
  }
}