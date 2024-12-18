import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('user.signup')
  async signup(data: SignupDto) {
    return this.authService.signup(data);
  }

  @MessagePattern('user.signin')
  async signin(data: SigninDto) {
    return this.authService.signin(data);
  }
}
