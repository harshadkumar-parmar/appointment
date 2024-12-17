import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { I18nService } from 'nestjs-i18n';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let i18nService: I18nService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        {
          provide: I18nService,
          useValue: {
            translate: jest.fn((message: string) => {
              const messages = {
                'errors:test': 'Test Exception Message',
              };
              return messages[message];
            }), // Mocking translate function
          },
        },
      ],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
    i18nService = module.get<I18nService>(I18nService);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should catch exception and return formatted response', async () => {
    const mockRequest = {
      url: '/test-url',
      headers: {
        'accept-language': 'en',
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue(mockResponse),
      getRequest: jest.fn().mockReturnValue(mockRequest),
    };

    const exception = new HttpException('errors:test', HttpStatus.BAD_REQUEST);

    await filter.catch(exception, mockArgumentsHost as any);

    expect(i18nService.translate).toHaveBeenCalledWith('errors:test', {
      lang: 'en',
    });
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Test Exception Message',
    });
  });
});
