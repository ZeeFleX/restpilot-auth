import { Controller } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @RabbitRPC({
    exchange: 'auth-exchange',
    routingKey: 'auth.test',
    queue: 'auth.test'
  })
  async testHandler(data: any) {
    return this.appService.test(data);
  }

  @RabbitRPC({
    exchange: 'auth-exchange',
    routingKey: 'auth.test2',
    queue: 'auth.test2'
  })
  async test2Handler(data: any) {
    return this.appService.test2(data);
  }
}
