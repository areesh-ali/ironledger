import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
      defaultVersion: '1'
  });
  app.setGlobalPrefix("api")
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);

  const appurl = await app.getUrl();

  Logger.log(`IronLedger API running at ${appurl}`, 'Bootstrap');

}

bootstrap().catch((error: unknown) => {
  console.error('Application startup failed:', error);
  process.exitCode = 1;
});