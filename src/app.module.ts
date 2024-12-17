import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { I18nModule, AcceptLanguageResolver } from 'nestjs-i18n';
import { join } from 'path';
config();

@Module({
  imports: [
    AppointmentsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      logger: 'simple-console',
      logging: true,
      synchronize: true, // Enable auto synchronization
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',

      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
