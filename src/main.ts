import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser'
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import { getConfigValue } from './config/main.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose', 'log'],
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  const PORT = await getConfigValue(configService, 'PORT', 3000);
  const DOMAIN = await getConfigValue(configService, 'DOMAIN', 'localhost');
  const GLOBAL_PREFIX = await getConfigValue(configService, 'GLOBAL_PREFIX', 'api');


  const allowedOrigins = [
    `http://95.27.74.242:3000`,
    `http://0.0.0.0:3000`,
    `http://localhost:3000`,
    `http://${DOMAIN}:${PORT}`
  ];
  
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.use(cookieParser())
  app.use(helmet())
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    exposedHeaders: 'set-cookie',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })

  try {
    await app.listen(PORT, '0.0.0.0', () => {
      console.log(`Application is running on: http://${DOMAIN}:${PORT}/${GLOBAL_PREFIX}`);
      console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1);
  }
}

bootstrap();
