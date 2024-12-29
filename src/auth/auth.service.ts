import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { AuthDTO } from 'shared-types';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { Logger } from 'shared-functions';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  @Logger('yellow')
  async signUp(signUpDto: AuthDTO.Request.SignUp) {
    try {
      const {
        phone,
        password,
        confirmPassword,
        firstname,
        lastname,
        surname,
        email,
      } = signUpDto;

      if (password !== confirmPassword) {
        throw new RpcException({
          code: 1002,
          message: 'PASSWORD_MISMATCH',
        });
      }

      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { phone },
      });

      if (existingUser) {
        throw new RpcException({
          code: 1001,
          message: 'USER_ALREADY_EXISTS',
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      // Get the CLIENT role
      const clientRole = await this.prisma.role.findUnique({
        where: { name: signUpDto.role || 'CLIENT' },
      });

      if (!clientRole) {
        throw new Error(
          'CLIENT role not found. Please run database seeds first.',
        );
      }

      // Create new user with CLIENT role
      const user = await this.prisma.user.create({
        data: {
          phone,
          password: hashedPassword,
          firstname,
          lastname,
          surname,
          email,
          role: {
            connect: {
              id: clientRole.id,
            },
          },
        },
        select: {
          id: true,
          phone: true,
          email: true,
          firstname: true,
          lastname: true,
          surname: true,
          role: {
            select: {
              name: true,
            },
          },
          createdAt: true,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Logger('yellow')
  async validateUser(phone: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { phone },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Prepare permissions array
    const permissions = user.role.rolePermissions.map(
      (rp) => rp.permission.name,
    );

    return {
      id: user.id,
      phone: user.phone,
      role: user.role.name,
      permissions,
    };
  }

  @Logger('yellow')
  async signIn(signInDto: AuthDTO.Request.SignIn) {
    const user = await this.validateUser(signInDto.phone, signInDto.password);

    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
      permissions: user.permissions,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  @Logger('yellow')
  async deleteUser({ id }: AuthDTO.Request.UserDelete) {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id,
        },
      });
      return user;
    } catch (error) {
      return error;
    }
  }
}
