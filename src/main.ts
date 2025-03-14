// import * as crypto from 'crypto';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomLoggerService } from './logger/custom-logger.service';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { ValidationPipe } from './pipes/validation.pipe';
import { ConfigService } from '@nestjs/config';
import { PORT } from './config/global.config';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(new CustomLoggerService());
  const logger = app.get(CustomLoggerService);
  const configService = app.get(ConfigService);

  // Swagger setup
  const config = new DocumentBuilder().setTitle('DataLouna test API').setDescription(``).addBearerAuth().setVersion('0.01').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: 0, docExpansion: 'none' },
  });

  // Global pipes
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  const port = configService.get(PORT);
  await app.listen(port, () => {
    logger.log(`App has started on port ${port}.`, 'Bootstrap');
  });
}
bootstrap();
