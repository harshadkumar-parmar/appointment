import { Module } from '@nestjs/common';
import { AppointmentService } from './appointments.service';
import { AppointmentController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentsModule {}
