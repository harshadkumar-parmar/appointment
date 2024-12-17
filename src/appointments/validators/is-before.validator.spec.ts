import { validate } from 'class-validator';
import { IsBefore } from './is-before.validator';
import { Type } from 'class-transformer';

class TestDto {
  @Type(() => Date)
  startDate: Date;

  @Type(() => Date)
  @IsBefore('startDate', {
    message: 'endDate must be after startDate',
  })
  endDate: Date;
}

describe('IsBefore', () => {
  it('should validate that endDate is before startDate', async () => {
    const dto = new TestDto();
    dto.startDate = new Date('2024-01-01T12:00:00Z');
    dto.endDate = new Date('2024-01-01T10:00:00Z');

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      IsBeforeConstraint: 'endDate must be after startDate',
    });
  });

  it('should validate successfully when endDate is after startDate', async () => {
    const dto = new TestDto();
    dto.startDate = new Date('2024-01-01T10:00:00Z');
    dto.endDate = new Date('2024-01-01T12:00:00Z');

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
