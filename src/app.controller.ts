import { Controller } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @RabbitRPC({
    exchange: 'auth-exchange',
    routingKey: 'auth.login',
    queue: 'auth-queue'
  })
  async login(data: { email: string; password: string }) {
    return this.appService.login(data);
  }

  @RabbitRPC({
    exchange: 'auth-exchange',
    routingKey: 'auth.register',
    queue: 'auth-queue'
  })
  async register(data: { email: string; password: string; name?: string }) {
    return this.appService.register(data);
  }
}
