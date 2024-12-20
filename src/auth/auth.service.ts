import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { ISignInRequestDTO, ISignUpRequestDTO } from 'src/types/shared';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: ISignUpRequestDTO) {
    const { phone, password } = signupDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Get the CLIENT role
    const clientRole = await this.prisma.role.findUnique({
      where: { name: 'CLIENT' },
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
        roleId: clientRole.id,
      },
      select: {
        id: true,
        phone: true,
        role: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
    });

    return user;
  }

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

  async signin(signinDto: ISignInRequestDTO) {
    const user = await this.validateUser(signinDto.phone, signinDto.password);

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
}
