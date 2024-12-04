import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitmqService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publish(routingKey: string, data: any) {
    const result = await this.amqpConnection.publish(
      'amq.direct',
      routingKey,
      data,
    );
    console.log(result);
  }

  async rpcSend(data: any) {
    const response = await this.amqpConnection.request<any>({
        exchange: 'auth-exchange',
        routingKey: 'authService',
        payload: data
    });

    return response;
  }
}
