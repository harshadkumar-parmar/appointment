import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  I18nService,
  I18nValidationExceptionFilter,
  I18nValidationPipe,
} from 'nestjs-i18n';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable custom exception filter
  const i18nService =
    app.get<I18nService<Record<string, unknown>>>(I18nService);
  app.useGlobalFilters(new HttpExceptionFilter(i18nService));

  // Enable validation
  app.useGlobalPipes(new I18nValidationPipe({}));

  // Error message filter for class validator
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Appointment Service')
    .setDescription('API documentation for the Appointment Service')
    .setVersion('1.0')
    .addGlobalParameters({
      name: 'Accept-Language',
      in: 'header',
      description: 'Language preference for the response',
      required: false,
      schema: { type: 'string', enum: ['en', 'de'], default: 'en' },
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
