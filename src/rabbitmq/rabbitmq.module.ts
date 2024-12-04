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
                    createExchangeIfNotExists: true,
                },
            ],
            uri: process.env.RABBITMQ_URI,
            enableControllerDiscovery: true
        })
    ],
    providers: [RabbitmqService],
    exports: [RabbitmqService]
})
export class RabbitmqModule {}
