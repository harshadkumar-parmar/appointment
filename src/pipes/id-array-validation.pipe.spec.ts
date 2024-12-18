import { Test, TestingModule } from '@nestjs/testing';
import { IDArrayValidationPipe } from './id-array-validation.pipe';
import { BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

describe('IDArrayValidationPipe', () => {
  let pipe: IDArrayValidationPipe;
  let i18nService: I18nService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IDArrayValidationPipe,
        {
          provide: I18nService,
          useValue: {
            translate: jest.fn((key: string) => {
              const messages = {
                'errors.stringArray': 'No doctor IDs were provided.',
              };
              return messages[key];
            }),
          },
        },
      ],
    }).compile();

    pipe = module.get<IDArrayValidationPipe>(IDArrayValidationPipe);
    i18nService = module.get<I18nService>(I18nService);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should throw an error if value is not an array', () => {
    const value = 'not-an-array';
    expect(() => pipe.transform(value, { type: 'query' })).toThrow(
      BadRequestException,
    );
    expect(i18nService.translate).toHaveBeenCalledWith('errors.stringArray');
  });

  it('should throw an error if array is empty', () => {
    const value: any[] = [];
    expect(() => pipe.transform(value, { type: 'query' })).toThrow(
      BadRequestException,
    );
    expect(i18nService.translate).toHaveBeenCalledWith('errors.stringArray');
  });

  it('should pass validation if array contains elements', () => {
    const value = ['doctor1', 'doctor2'];
    expect(pipe.transform(value, { type: 'query' })).toEqual(value);
  });
});
