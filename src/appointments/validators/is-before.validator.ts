import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsBeforeConstraint implements ValidatorConstraintInterface {
  constructor(private readonly i18n: I18nService) {}

  async validate(endTime: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return relatedValue < endTime;
  }
}

/**
 * Decorator that checks if the value of the current property is before the value of
 * the specified property. It uses `IsBeforeConstraint` for validation.
 *
 * @param property - The name of the property to compare against.
 * @param validationOptions - Optional validation options.
 */
export function IsBefore(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsBeforeConstraint,
    });
  };
}
