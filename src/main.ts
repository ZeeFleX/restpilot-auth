import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configure RabbitMQ microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URI')],
      queue: 'auth-service',
      queueOptions: {
        durable: true,
      },
    },
  });

  // Start all microservices and then start HTTP
  await app.startAllMicroservices();
  await app.listen(configService.get<number>('PORT', 3002));

  console.log(
    `Auth microservice is running on port ${configService.get<number>('PORT', 3002)}`,
  );
  console.log(
    `RabbitMQ connected to ${configService.get<string>('RABBITMQ_URI')}`,
  );
}
bootstrap();
