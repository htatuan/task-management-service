import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TasksModule } from './tasks/tasks.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TasksModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, './tasks/proto/task.proto'),
        package: 'task',
        url: 'localhost:50051',
      },
    },
  );
  await app.listen();
}
bootstrap();
