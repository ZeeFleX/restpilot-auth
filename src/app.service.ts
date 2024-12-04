import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // TODO: Add proper password hashing and verification
    if (user.password !== data.password) {
      return { success: false, message: 'Invalid password' };
    }

    return { 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    };
  }

  async register(data: { email: string; password: string; name?: string }) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: data.password, // TODO: Add password hashing
          name: data.name,
        },
      });

      return { 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      };
    } catch (error) {
      if (error.code === 'P2002') {
        return { success: false, message: 'Email already exists' };
      }
      throw error;
    }
  }
}
