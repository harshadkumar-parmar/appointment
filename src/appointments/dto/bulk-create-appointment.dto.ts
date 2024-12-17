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

export class BulkCreateAppointmentDto {
  @ApiProperty({ example: 'doctor1', description: 'The ID of the doctor' })
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({
    example: ['patient1', 'patient2', 'patient3'],
    description: 'The IDs of the patients',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  patientIds: string[];

  @ApiProperty({
    example: '2024-01-01T10:00:00Z',
    description: 'The start time for the first appointment',
  })
  @IsDate()
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({
    example: 10,
    description: 'The duration of each slot in minutes',
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  slotDuration: number;
}
