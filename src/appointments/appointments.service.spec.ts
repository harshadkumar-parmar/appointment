import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { In, Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { BulkCreateAppointmentDto } from './dto/bulk-create-appointment.dto';
import { PatientBulkCreateAppointmentDto } from './dto/bulk-appointment-patient.dto';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let repository: Repository<Appointment>;
  const mockAppointmentRepository = {
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(0),
      getOne: jest.fn().mockResolvedValue(null),
    })),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    manager: {
      connection: {
        createQueryRunner: jest.fn(() => ({
          connect: jest.fn(),
          startTransaction: jest.fn(),
          rollbackTransaction: jest.fn(),
          commitTransaction: jest.fn(),
          release: jest.fn(),
        })),
      },
    },
  };
  const mockI18nService = {
    translate: jest.fn().mockImplementation((key: string, options: any) => {
      const translations = {
        'message.hello': 'Hello World!',
        'errors.conflict': 'Appointment already booked for the same timeslot.',
        'message.appointment_booked': 'Appointment booked successfully.',
      };
      return translations[key];
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: mockAppointmentRepository,
        },
        { provide: I18nService, useValue: mockI18nService },
      ],
    }).compile();
    service = module.get<AppointmentService>(AppointmentService);
    repository = module.get<Repository<Appointment>>(
      getRepositoryToken(Appointment),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('bookAppointment', () => {
    it('should book an appointment successfully', async () => {
      const createAppointmentDto: CreateAppointmentDto = {
        doctorId: 'doctor1',
        patientId: 'patient1',
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T11:00:00Z'),
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      } as any);

      jest
        .spyOn(repository, 'create')
        .mockReturnValue(createAppointmentDto as any);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(createAppointmentDto as any);

      const result = await service.bookAppointment(createAppointmentDto);
      expect(result).toBe('Appointment booked successfully.');
    });

    it('should throw a conflict exception if there is a conflict', async () => {
      const createAppointmentDto: CreateAppointmentDto = {
        doctorId: 'doctor1',
        patientId: 'patient1',
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T11:00:00Z'),
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({}),
      } as any);

      await expect(
        service.bookAppointment(createAppointmentDto),
      ).rejects.toThrow(
        new HttpException('errors.conflict', HttpStatus.CONFLICT),
      );
    });

    describe('bookBulkAppointment', () => {
      it('should book bulk appointments successfully', async () => {
        const bulkCreateAppointmentDto: BulkCreateAppointmentDto = {
          doctorId: 'doctor1',
          patientIds: ['patient1', 'patient2'],
          startTime: new Date('2024-01-01T10:00:00Z'),
          slotDuration: 10,
        };

        jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockResolvedValue(0),
        } as any);

        jest.spyOn(repository, 'create').mockReturnValue({} as any);
        jest.spyOn(repository, 'save').mockResolvedValue({} as any);
        const result = await service.bookBulkAppointment(
          bulkCreateAppointmentDto,
        );
        expect(result).toBe('Appointment booked successfully.');
      });
      it('should throw a conflict exception if there is a conflict', async () => {
        const bulkCreateAppointmentDto: BulkCreateAppointmentDto = {
          doctorId: 'doctor1',
          patientIds: ['patient1', 'patient2'],
          startTime: new Date('2024-01-01T10:00:00Z'),
          slotDuration: 10,
        };

        jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockResolvedValue(1),
        } as any);

        jest
          .spyOn(repository.manager.connection, 'createQueryRunner')
          .mockReturnValue({
            connect: jest.fn(),
            startTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
          } as any);

        await expect(
          service.bookBulkAppointment(bulkCreateAppointmentDto),
        ).rejects.toThrow(
          new HttpException('errors.conflict', HttpStatus.CONFLICT),
        );
      });
    });
  });

  describe('patientBookBulkAppointment', () => {
    it('should book bulk appointments for patients successfully', async () => {
      const patientBulkCreateAppointmentDto: PatientBulkCreateAppointmentDto = {
        patientId: 'patient1',
        doctorIds: ['doctor1', 'doctor2'],
        startTime: new Date('2024-01-01T10:00:00Z'),
        slotDuration: 10,
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0),
      } as any);

      jest.spyOn(repository, 'create').mockReturnValue({} as any);
      jest.spyOn(repository, 'save').mockResolvedValue({} as any);
      jest
        .spyOn(repository.manager.connection, 'createQueryRunner')
        .mockReturnValue({
          connect: jest.fn(),
          startTransaction: jest.fn(),
          commitTransaction: jest.fn(),
          rollbackTransaction: jest.fn(),
          release: jest.fn(),
        } as any);

      const result = await service.patientBookBulkAppointment(
        patientBulkCreateAppointmentDto,
      );
      expect(result).toBe('Appointment booked successfully.');
    });

    it('should throw a conflict exception if there is a conflict', async () => {
      const patientBulkCreateAppointmentDto: PatientBulkCreateAppointmentDto = {
        patientId: 'patient1',
        doctorIds: ['doctor1', 'doctor2'],
        startTime: new Date('2024-01-01T10:00:00Z'),
        slotDuration: 10,
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
      } as any);

      jest
        .spyOn(repository.manager.connection, 'createQueryRunner')
        .mockReturnValue({
          connect: jest.fn(),
          startTransaction: jest.fn(),
          rollbackTransaction: jest.fn(),
          release: jest.fn(),
        } as any);

      await expect(
        service.patientBookBulkAppointment(patientBulkCreateAppointmentDto),
      ).rejects.toThrow(
        new HttpException('errors.conflict', HttpStatus.CONFLICT),
      );
    });
  });

  describe('Get Appointments', () => {

    it('should return appointments for a patient', async () => {
      const patientId = 'patient1';

      jest.spyOn(repository, 'find').mockResolvedValue([]);

      const result = await service.getAppointmentsByPatient(patientId);

      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalledWith({ where: { patientId } });
    });

    it('should return appointments for a doctor', async () => {
      const doctorId = 'doctor1';

      jest.spyOn(repository, 'find').mockResolvedValue([]);

      const result = await service.getAppointmentsByDoctor(doctorId);
      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalledWith({ where: { doctorId } });
    })

    it('should get appointments for multiple doctors', async () => {
      const doctorIds = ['doctor1', 'doctor2'];

      jest.spyOn(repository, 'find').mockResolvedValue([
        { doctorId: 'doctor1', id: 1 },
        { doctorId: 'doctor2', id: 2 },
        { doctorId: 'doctor2', id: 3 }
      ] as Appointment[]);
      
      const result = await service.getAppointmentsByDoctors(doctorIds);
      expect(result).toEqual({
        doctor1: [{
          doctorId: 'doctor1',
          id: 1
      }], 
      doctor2: [{
        doctorId: 'doctor2',
        id: 2
      },{
        doctorId: 'doctor2',
        id: 3
      }] 
    });
      expect(repository.find).toHaveBeenCalledWith({ where: { doctorId: In(doctorIds) } });
    });
  });

});
