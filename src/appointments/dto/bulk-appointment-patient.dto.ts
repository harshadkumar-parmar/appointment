import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsDate,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PatientBulkCreateAppointmentDto {
  @ApiProperty({ example: 'patient1', description: 'The ID of the patient' })
  @IsString({
    message: i18nValidationMessage('errors.patient_id_must_be_string'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('errors.patient_id_required') })
  patientId: string;

  @ApiProperty({
    example: ['doctor1', 'doctor2'],
    description: 'The IDs of the doctors',
  })
  @IsArray({
    message: i18nValidationMessage('errors.doctor_ids_must_be_array'),
  })
  @IsString({
    each: true,
    message: i18nValidationMessage('errors.doctor_ids_must_be_string'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('errors.doctor_ids_required') })
  doctorIds: string[];

  @ApiProperty({
    example: '2024-01-01T10:00:00Z',
    description: 'The start time for the first appointment',
  })
  @IsDate({ message: i18nValidationMessage('errors.start_time_must_be_date') })
  @IsNotEmpty({ message: i18nValidationMessage('errors.start_time_required') })
  startTime: Date;

  @ApiProperty({
    example: 10,
    description: 'The duration of each slot in minutes',
  })
  @IsInt({
    message: i18nValidationMessage('errors.slot_duration_must_be_integer'),
  })
  @Min(1, { message: i18nValidationMessage('errors.slot_duration_min') })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.slot_duration_required'),
  })
  slotDuration: number;
}
