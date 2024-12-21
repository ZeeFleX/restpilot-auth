import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthDTO } from 'shared-types';
import { Logger } from 'shared-functions';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.user.create')
  @Logger('yellow')
  async signup(data: AuthDTO.Request.SignUp) {
    return this.authService.signUp(data);
  }

  @MessagePattern('auth.user.delete')
  @Logger('yellow')
  async deleteUser(data: AuthDTO.Request.UserDelete) {
    return this.authService.deleteUser(data);
  }

  @MessagePattern('auth.user.signIn')
  @Logger('yellow')
  async signin(data: AuthDTO.Request.SignIn) {
    return this.authService.signIn(data);
  }
}
