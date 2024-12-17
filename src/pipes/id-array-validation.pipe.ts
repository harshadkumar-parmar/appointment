import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class IDArrayValidationPipe implements PipeTransform {
  constructor(private readonly i18n: I18nService) {}

  /**
   * Validates the doctorIds query parameter.
   *
   * @param value The value of the doctorIds query parameter.
   * @param metadata Metadata about the parameter.
   *
   * @throws BadRequestException if the doctorIds parameter is not an array or is empty.
   *
   * @returns The validated doctorIds array.
   */
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || !Array.isArray(value) || value.length === 0) {
      throw new BadRequestException(this.i18n.translate('errors.noDoctorIds'));
    }
    return value;
  }
}
