import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  test(data): any {
    return data;
  }

  test2(data): any {
    return 'Тест второй';
  }
}

