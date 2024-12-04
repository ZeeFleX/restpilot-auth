import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitmqService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async rpcSend(exchange: string, routingKey: string, payload: any) {
    const response = await this.amqpConnection.request<any>({
        exchange,
        routingKey,
        payload
    })

    return response
  }
}
