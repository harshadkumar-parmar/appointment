import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { BulkCreateAppointmentDto } from './dto/bulk-create-appointment.dto';
import { PatientBulkCreateAppointmentDto } from './dto/bulk-appointment-patient.dto';

@Injectable()
export class AppointmentService {
  /**
   * Creates an instance of AppointmentService.
   *
   * @param appointmentRepository - The repository used for accessing and managing appointments in the database.
   * @param i18n - The internationalization service used for handling localized messages and translations.
   */
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly i18n: I18nService,
  ) { }

  /**
   * Creates a new appointment.
   *
   * @param createAppointmentDto - The appointment's properties.
   *
   * @returns A localized message indicating the result of the booking attempt.
   *
   * @throws ConflictException if another appointment with the same doctor or patient exists at the same time.
   */
  async bookAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<string> {
    const { doctorId, patientId, startTime, endTime } = createAppointmentDto;

    // Check for conflicts
    const appointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      // Check for both ends if doctor or patient has booking with conflicting timeslote
      .where(
        'appointment.doctorId = :doctorId OR appointment.patientId = :patientId',
        { doctorId, patientId },
      )
      .andWhere(
        '(appointment.startTime < :endTime AND appointment.endTime > :startTime)',
        { startTime, endTime },
      )
      .getOne();

    if (appointments) {
      throw new HttpException('errors.conflict', HttpStatus.CONFLICT);
    }

    const appointment = this.appointmentRepository.create(createAppointmentDto);
    await this.appointmentRepository.save(appointment);
    return this.i18n.translate('message.appointment_booked');
  }

  /**
   * Creates multiple appointments for a doctor and multiple patients.
   *
   * @param bulkCreateAppointmentDto - The appointments' properties.
   *
   * @returns A localized message indicating the result of the booking attempt.
   *
   * @throws ConflictException if another appointment with the same doctor or patient exists at the same time.
   */
  async bookBulkAppointment(
    bulkCreateAppointmentDto: BulkCreateAppointmentDto,
  ): Promise<string> {
    const { doctorId, patientIds, startTime, slotDuration } =
      bulkCreateAppointmentDto;

    const queryRunner =
      this.appointmentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let currentTime = new Date(startTime);
      const appointments = [];

      for (const patientId of patientIds) {
        const endTime = new Date(currentTime.getTime() + slotDuration * 60000);

        const hasConflict = await this.appointmentRepository
          .createQueryBuilder('appointment')
          .where(
            'appointment.doctorId = :doctorId OR appointment.patientId = :patientId',
            { doctorId, patientId },
          )
          .andWhere(
            '(appointment.startTime < :endTime AND appointment.endTime > :startTime)',
            { startTime: currentTime, endTime },
          )
          .getCount();

        if (hasConflict) {
          throw new HttpException('errors.conflict', HttpStatus.CONFLICT);
        }

        const appointment = this.appointmentRepository.create({
          doctorId,
          patientId,
          startTime: new Date(currentTime),
          endTime,
        });

        appointments.push(appointment);
        currentTime = endTime;
      }

      await this.appointmentRepository.save(appointments, {
        transaction: false,
      });
      await queryRunner.commitTransaction();

      return this.i18n.translate('message.appointment_booked');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async patientBookBulkAppointment(
    bulkCreateAppointmentDto: PatientBulkCreateAppointmentDto,
  ): Promise<string> {
    const { patientId, doctorIds, startTime, slotDuration } =
      bulkCreateAppointmentDto;

    const queryRunner =
      this.appointmentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let currentTime = new Date(startTime);
      const appointments = [];

      for (const doctorId of doctorIds) {
        const endTime = new Date(currentTime.getTime() + slotDuration * 60000);

        const hasConflict = await this.appointmentRepository
          .createQueryBuilder('appointment')
          .where(
            'appointment.doctorId = :doctorId OR appointment.patientId = :patientId',
            { doctorId, patientId },
          )
          .andWhere(
            '(appointment.startTime < :endTime AND appointment.endTime > :startTime)',
            { startTime: currentTime, endTime },
          )
          .getCount();

        if (hasConflict) {
          throw new HttpException('errors.conflict', HttpStatus.CONFLICT);
        }

        const appointment = this.appointmentRepository.create({
          doctorId,
          patientId,
          startTime: new Date(currentTime),
          endTime,
        });

        appointments.push(appointment);
        currentTime = endTime;
      }

      await this.appointmentRepository.save(appointments, {
        transaction: false,
      });
      await queryRunner.commitTransaction();

      return this.i18n.translate('message.appointment_booked');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Retrieves all appointments for a specified doctor.
   *
   * @param doctorId - The ID of the doctor whose appointments are to be retrieved.
   *
   * @returns A promise that resolves to an array of Appointment entities associated with the specified doctor.
   */
  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({ where: { doctorId } });
  }

  /**
   * Retrieves all appointments for a specified patient.
   *
   * @param patientId - The ID of the patient whose appointments are to be retrieved.
   *
   * @returns A promise that resolves to an array of Appointment entities associated with the specified patient.
   */
  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({ where: { patientId } });
  }

  async getAppointmentsByDoctors(
    doctorIds: string[],
  ): Promise<{ [key: string]: Appointment[] }> {
    const appointments = await this.appointmentRepository.find({
      where: { doctorId: In(doctorIds) },
    });
    return appointments.reduce((acc: { [key: string]: Appointment[] }, appointment) => {
      if (acc[appointment.doctorId]) {
        acc[appointment.doctorId].push(appointment);
      } else {
        acc[appointment.doctorId] = [appointment];
      }
      return acc;
    }, {});
  }
}
