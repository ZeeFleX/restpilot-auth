import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RabbitmqService } from "./rabbitmq.service";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: 'auth-exchange',
                    type: 'direct',
                    createExchangeIfNotExists: true
                }
            ],
            queues: [
                {
                    name: 'auth-queue',
                    createQueueIfNotExists: true,
                    routingKey: 'authService',
                    exchange: 'auth-exchange'
                }
            ],
            uri: 'amqp://guest:guest@rabbitmq:5672',
            enableControllerDiscovery: true
        })
    ],
    providers: [RabbitmqService],
    exports: [RabbitmqService]
})
export class RabbitmqModule {}
