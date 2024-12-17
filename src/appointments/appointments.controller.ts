import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UsePipes,
} from '@nestjs/common';
import { AppointmentService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BulkCreateAppointmentDto } from './dto/bulk-create-appointment.dto';
import { PatientBulkCreateAppointmentDto } from './dto/bulk-appointment-patient.dto';
import { IDArrayValidationPipe } from '../pipes/id-array-validation.pipe';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('book')
  @ApiOperation({ summary: 'Book an appointment' })
  @ApiResponse({ status: 201, description: 'Appointment booked successfully.' })
  @ApiResponse({ status: 409, description: 'Conflict detected.' })
  bookAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<string> {
    return this.appointmentService.bookAppointment(createAppointmentDto);
  }

  @Post('doctors')
  @ApiOperation({ summary: 'Book bulk appointments' })
  @ApiResponse({
    status: 201,
    description: 'Appointments booked successfully.',
  })
  @ApiResponse({ status: 409, description: 'Conflict detected.' })
  async patientBookBulkAppointment(
    @Body() bulkCreateAppointmentDto: PatientBulkCreateAppointmentDto,
  ): Promise<string> {
    return this.appointmentService.patientBookBulkAppointment(
      bulkCreateAppointmentDto,
    );
  }

  @Post('patients')
  @ApiOperation({ summary: 'Book bulk appointments' })
  @ApiResponse({
    status: 201,
    description: 'Appointments booked successfully.',
  })
  @ApiResponse({ status: 409, description: 'Conflict detected.' })
  async bookBulkAppointment(
    @Body() bulkCreateAppointmentDto: BulkCreateAppointmentDto,
  ): Promise<string> {
    return this.appointmentService.bookBulkAppointment(
      bulkCreateAppointmentDto,
    );
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Get appointments by doctor' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved appointments successfully.',
  })
  getAppointmentsByDoctor(
    @Param('doctorId') doctorId: string,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByDoctor(doctorId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get appointments by patient' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved appointments successfully.',
  })
  getAppointmentsByPatient(
    @Param('patientId') patientId: string,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByPatient(patientId);
  }

  @Get('doctors')
  @ApiOperation({ summary: 'Get schedules for multiple doctors' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved schedules successfully.',
  })
  @UsePipes(IDArrayValidationPipe)
  async getAppointmentsByDoctors(
    @Query('doctorIds') doctorIds: string[],
  ): Promise<{ [key: string]: Appointment[] }> {
    // NestJs supports array string for query paramter but split the string in case of single array element
    // Ensure doctorIds is an array
    if (!Array.isArray(doctorIds)) {
      doctorIds = [doctorIds];
    }
    return this.appointmentService.getAppointmentsByDoctors(doctorIds);
  }
}
