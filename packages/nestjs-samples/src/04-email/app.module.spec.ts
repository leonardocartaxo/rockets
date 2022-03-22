import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { EmailService } from '@concepta/nestjs-email';
import { NotificationController } from './notification/notification.controller';

describe('AppModule', () => {
  let notificationController: NotificationController;
  let spyService: jest.SpyInstance;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    notificationController = app.get<NotificationController>(
      NotificationController,
    );

    spyService = jest
      .spyOn(EmailService.prototype, 'sendEmail')
      .mockImplementation(() => {
        return null;
      });
  });

  describe('Notification Controller', () => {
    it('Create notification', () => {
      notificationController.create({ emailAddress: 'email@email.com' });
      expect(spyService).toBeCalledTimes(1);
    });
  });
});
