import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentController } from './appointments.controller';
import { AppointmentService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { BulkCreateAppointmentDto } from './dto/bulk-create-appointment.dto';
import { PatientBulkCreateAppointmentDto } from './dto/bulk-appointment-patient.dto';
import { I18nService } from 'nestjs-i18n';

describe('AppointmentController', () => {
  let controller: AppointmentController;
  let service: AppointmentService;

  const mockAppointmentService = {
    bookAppointment: jest.fn((dto) => 'Appointment booked successfully.'),
    patientBookBulkAppointment: jest.fn(
      (dto) => 'Appointments booked successfully.',
    ),
    bookBulkAppointment: jest.fn((dto) => 'Appointments booked successfully.'),
    getAppointmentsByDoctor: jest.fn((doctorId) => []),
    getAppointmentsByPatient: jest.fn((patientId) => []),
    getAppointmentsByDoctors: jest.fn((doctorIds) => ({})),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        {
          provide: I18nService,
          useValue: {
            translate: jest.fn((key: string) => key),
          },
        },
        {
          provide: AppointmentService,
          useValue: mockAppointmentService,
        },
      ],
    }).compile();

    controller = module.get<AppointmentController>(AppointmentController);
    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should book an appointment', async () => {
    const dto: CreateAppointmentDto = {
      doctorId: 'doctor1',
      patientId: 'patient1',
      startTime: new Date(),
      endTime: new Date(),
    };
    const result = await controller.bookAppointment(dto);
    expect(result).toBe('Appointment booked successfully.');
    expect(service.bookAppointment).toHaveBeenCalledWith(dto);
  });

  it('should book bulk appointments for a patient', async () => {
    const dto: PatientBulkCreateAppointmentDto = {
      patientId: 'patient1',
      doctorIds: ['doctor1', 'doctor2'],
      startTime: new Date(),
      slotDuration: 10,
    };
    const result = await controller.patientBookBulkAppointment(dto);
    expect(result).toBe('Appointments booked successfully.');
    expect(service.patientBookBulkAppointment).toHaveBeenCalledWith(dto);
  });

  it('should book bulk appointments for a doctor', async () => {
    const dto: BulkCreateAppointmentDto = {
      doctorId: 'doctor1',
      patientIds: ['patient1', 'patient2'],
      startTime: new Date(),
      slotDuration: 10,
    };
    const result = await controller.bookBulkAppointment(dto);
    expect(result).toBe('Appointments booked successfully.');
    expect(service.bookBulkAppointment).toHaveBeenCalledWith(dto);
  });

  it('should get appointments by doctor', async () => {
    const doctorId = 'doctor1';
    const result = await controller.getAppointmentsByDoctor(doctorId);
    expect(result).toEqual([]);
    expect(service.getAppointmentsByDoctor).toHaveBeenCalledWith(doctorId);
  });

  it('should get appointments by patient', async () => {
    const patientId = 'patient1';
    const result = await controller.getAppointmentsByPatient(patientId);
    expect(result).toEqual([]);
    expect(service.getAppointmentsByPatient).toHaveBeenCalledWith(patientId);
  });

  it('should get appointments by multiple doctors', async () => {
    const doctorIds = ['doctor1', 'doctor2'];
    const result = await controller.getAppointmentsByDoctors(doctorIds);
    expect(result).toEqual({});
    expect(service.getAppointmentsByDoctors).toHaveBeenCalledWith(doctorIds);
  });

  it('should get appointments by single doctors', async () => {
    const doctorIds = 'doctor1';
    const result = await controller.getAppointmentsByDoctors(doctorIds as any);
    expect(result).toEqual({});
    expect(service.getAppointmentsByDoctors).toHaveBeenCalledWith([doctorIds]);
  });
});
