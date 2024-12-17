import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsNotEmpty, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsBefore } from '../validators/is-before.validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: '123', description: 'The ID of the doctor' })
  @IsString({
    message: i18nValidationMessage('errors.doctor_id_must_be_string'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('errors.doctor_id_required') })
  doctorId: string;

  @ApiProperty({ example: '456', description: 'The ID of the patient' })
  @IsString({
    message: i18nValidationMessage('errors.patient_id_must_be_string'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('errors.patient_id_required') })
  patientId: string;

  @ApiProperty({
    example: '2024-01-01T10:00:00Z',
    description: 'The start time of the appointment',
  })
  @IsDate({ message: i18nValidationMessage('errors.start_time_must_be_date') })
  @IsNotEmpty({ message: i18nValidationMessage('errors.start_time_required') })
  startTime: Date;

  @ApiProperty({
    example: '2024-01-01T11:00:00Z',
    description: 'The end time of the appointment',
  })
  @IsDate({ message: i18nValidationMessage('errors.end_time_must_be_date') })
  @IsNotEmpty({ message: i18nValidationMessage('errors.end_time_required') })
  @IsBefore('startTime', { message: 'errors.start_time_before_end_time' })
  endTime: Date;
}
