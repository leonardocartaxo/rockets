import ms from 'ms';
import { CrudModule } from '@concepta/nestjs-crud';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';
import { useSeeders } from '@jorgebodega/typeorm-seeding';
import { Test, TestingModule } from '@nestjs/testing';
import { OtpModule } from '../otp.module';
import { OtpService } from './otp.service';
import { OtpInterface } from '../interfaces/otp.interface';
import { OtpTypeNotDefinedException } from '../exceptions/otp-type-not-defined.exception';

import { UserEntityFixture } from '../__fixtures__/entities/user-entity.fixture';
import { UserOtpEntityFixture } from '../__fixtures__/entities/user-otp-entity.fixture';
import { UserOtpRepositoryFixture } from '../__fixtures__/repositories/user-otp-repository.fixture';
import { UserFactoryFixture } from '../__fixtures__/factories/user.factory.fixture';
import { UserOtpFactoryFixture } from '../__fixtures__/factories/user-otp.factory.fixture';

describe('OtpModule', () => {
  const CATEGORY_DEFAULT = 'CATEGORY_DEFAULT';

  let testModule: TestingModule;
  let otpModule: OtpModule;
  let otpService: OtpService;
  let connectionNumber = 1;
  const userFactory = new UserFactoryFixture();
  const userOtpFactory = new UserOtpFactoryFixture();

  const factoryCreateUser = async () => {
    return userFactory.create();
  };

  const factoryCreateOtp = async (
    overrides: Partial<OtpInterface> & Pick<OtpInterface, 'assignee'>,
  ) => {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + ms('1d'));

    return userOtpFactory.create({
      category: CATEGORY_DEFAULT,
      expirationDate: expirationDate,
      ...overrides,
    });
  };

  const defaultCreateOtp = async (
    options: Pick<OtpInterface, 'assignee'> &
      Partial<Pick<OtpInterface, 'type'>>,
  ) =>
    await otpService.create('userOtp', {
      type: 'uuid',
      category: CATEGORY_DEFAULT,
      ...options,
    });

  // try to delete
  const defaultDeleteOtp = async (
    options: Pick<OtpInterface, 'assignee' | 'passcode'>,
  ) =>
    await otpService.delete(
      'userOtp',
      options.assignee,
      CATEGORY_DEFAULT,
      options.passcode,
    );

  const defaultIsValidOtp = async (
    options: Pick<OtpInterface, 'assignee' | 'passcode'>,
    deleteIfValid?: boolean,
  ) =>
    await otpService.isValid(
      'userOtp',
      options.assignee,
      CATEGORY_DEFAULT,
      options.passcode,
      deleteIfValid,
    );

  beforeEach(async () => {
    const connectionName = `test_${connectionNumber++}`;

    testModule = await Test.createTestingModule({
      imports: [
        TypeOrmExtModule.register({
          name: connectionName,
          type: 'sqlite',
          database: ':memory:',
          synchronize: true,
          entities: [UserEntityFixture, UserOtpEntityFixture],
        }),
        OtpModule.register({
          entities: {
            userOtp: {
              entity: UserOtpEntityFixture,
              repository: UserOtpRepositoryFixture,
              connection: connectionName,
            },
          },
        }),
        CrudModule.register(),
      ],
    }).compile();

    await useSeeders([], {
      root: __dirname,
      connection: connectionName,
    });

    otpModule = testModule.get<OtpModule>(OtpModule);
    otpService = testModule.get<OtpService>(OtpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    testModule.close();
  });

  describe('module', () => {
    it('should be loaded', async () => {
      expect(otpModule).toBeInstanceOf(OtpModule);
    });
    it('should be have expected services', async () => {
      expect(otpService).toBeInstanceOf(OtpService);
    });
  });

  describe('otpService isValid', () => {
    it('check if is valid true', async () => {
      const assignee = await factoryCreateUser();
      const otp = await factoryCreateOtp({ assignee });
      expect(await defaultIsValidOtp(otp)).toBe(true);
    });

    it('check if is valid after delete', async () => {
      const assignee = await factoryCreateUser();
      const otp = await factoryCreateOtp({ assignee });
      expect(await defaultIsValidOtp(otp, true)).toBe(true);
      expect(await defaultIsValidOtp(otp)).toBe(false);
      expect(await defaultIsValidOtp(otp, true)).toBe(false);
    });

    it('check if is expired', async () => {
      const now = new Date();
      const expirationDate = new Date(now.getTime() - ms('1d'));

      const assignee = await factoryCreateUser();

      const otp = await factoryCreateOtp({
        expirationDate: expirationDate,
        assignee,
      });

      expect(await defaultIsValidOtp(otp)).toBe(false);
    });
  });

  describe('otpService create', () => {
    it('create with success', async () => {
      const assignee = await factoryCreateUser();
      const otp = await defaultCreateOtp({ assignee });

      expect(otp.category).toBe(CATEGORY_DEFAULT);
      expect(otp.type).toBe('uuid');
      expect(typeof otp.passcode).toBe('string');
      expect(otp.passcode.length).toBeGreaterThan(0);
      expect(otp.expirationDate).toBeInstanceOf(Date);
      expect(otp.assignee.id).toBeTruthy();
    });

    it('create with fail', async () => {
      const assignee = await factoryCreateUser();
      const otp = await defaultCreateOtp({ assignee });

      expect(otp).toBeTruthy();
      expect(
        await defaultIsValidOtp({
          assignee,
          passcode: 'INVALID',
        }),
      ).toBe(false);
    });

    it('create with fail 2', async () => {
      try {
        const assignee = await factoryCreateUser();
        await defaultCreateOtp({ assignee, type: 'wrongType' });
      } catch (e) {
        expect(e).toBeInstanceOf(OtpTypeNotDefinedException);
      }
    });
  });

  describe('otpService delete', () => {
    it('delete with success', async () => {
      const assignee = await factoryCreateUser();
      const otp = await defaultCreateOtp({ assignee });
      expect(otp).toBeTruthy();

      // try to delete
      expect(await defaultDeleteOtp(otp)).toBeUndefined();

      // check if deleted is valid
      expect(await defaultIsValidOtp(otp)).toBe(false);
    });
  });

  describe('otpService clear', () => {
    it('clear with success', async () => {
      const assignee = await factoryCreateUser();
      const otp = await defaultCreateOtp({ assignee });

      expect(otp).toBeTruthy();
      expect(await defaultIsValidOtp(otp)).toBe(true);

      const otp2 = await defaultCreateOtp({ assignee });
      expect(otp2).toBeTruthy();
      expect(await defaultIsValidOtp(otp2)).toBe(true);

      // try to clear
      expect(
        await otpService.clear('userOtp', assignee, CATEGORY_DEFAULT),
      ).toBeUndefined();

      // cleared passcodes should be invalid
      // TODO: check that they were actually removed from database
      expect(await defaultIsValidOtp(otp)).toBe(false);
      expect(await defaultIsValidOtp(otp2)).toBe(false);
    });
  });
});
