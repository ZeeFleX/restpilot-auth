import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthDTO } from 'src/types/shared';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('user.signUp')
  async signup(data: AuthDTO.Request.SignUp) {
    return this.authService.signUp(data);
  }

  @MessagePattern('user.signIn')
  async signin(data: AuthDTO.Request.SignIn) {
    return this.authService.signIn(data);
  }
}
