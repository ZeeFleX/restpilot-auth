import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { ISignUpRequestDTO, ISignInRequestDTO } from 'src/types/shared';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('user.signUp')
  async signup(data: ISignUpRequestDTO) {
    return this.authService.signUp(data);
  }

  @MessagePattern('user.signIn')
  async signin(data: ISignInRequestDTO) {
    return this.authService.signIn(data);
  }
}
