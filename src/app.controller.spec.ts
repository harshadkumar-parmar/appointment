import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { I18nService, I18nContext } from 'nestjs-i18n';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: I18nService,
          useValue: {
            t: jest.fn().mockImplementation((key: string) => {
              const translations = {
                'message.hello': 'Hello World!',
              };
              return translations[key];
            }),
          },
        },
      ],
    }).compile();
    jest
      .spyOn(I18nContext, 'current')
      .mockImplementation(() => ({ lang: 'en' }) as any);
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
