import { Controller } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @RabbitRPC({
    exchange: 'auth-exchange',
    routingKey: 'auth.test',
    queue: 'auth-queue'
  })
  async test(data: any) {
    return this.appService.test(data);
  }
}
