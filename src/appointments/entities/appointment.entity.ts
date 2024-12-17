import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  doctorId: string;

  @Column()
  patientId: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;
}
