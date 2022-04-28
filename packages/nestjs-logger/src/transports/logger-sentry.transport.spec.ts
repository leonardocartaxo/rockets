import { LogLevel } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as Sentry from '@sentry/node';
import { Severity as SentryLogSeverity } from '@sentry/types';
import { LOGGER_MODULE_OPTIONS_TOKEN } from '../config/logger.config';
import { LoggerOptionsInterface } from '../interfaces/logger-options.interface';
import { LoggerSentryConfigInterface } from '../interfaces/logger-sentry-config.interface';

import { LoggerSentryTransport } from './logger-sentry.transport';
jest.mock('@sentry/node');

describe('loggerSentryTransport', () => {
  let loggerSentryTransport: LoggerSentryTransport;
  let config: LoggerOptionsInterface;
  let spyInit: jest.SpyInstance;
  let spyCaptureException: jest.SpyInstance;
  let spyCaptureMessage: jest.SpyInstance;
  let spyLogLevelMap: jest.SpyInstance;
  let errorMessage: string;

  beforeEach(async () => {
    const transportSentryConfig: LoggerSentryConfigInterface = {
      dsn: '',
      logLevelMap: jest.fn().mockReturnValue(SentryLogSeverity.Error),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_MODULE_OPTIONS_TOKEN,
          useValue: {
            settings: {
              transportSentryConfig,
            },
          },
        },
      ],
    }).compile();

    loggerSentryTransport = new LoggerSentryTransport(transportSentryConfig);

    config = moduleRef.get<LoggerOptionsInterface>(LOGGER_MODULE_OPTIONS_TOKEN);

    spyInit = jest.spyOn(Sentry, 'init');
    spyCaptureException = jest.spyOn(Sentry, 'captureException');
    spyCaptureMessage = jest.spyOn(Sentry, 'captureMessage');
    spyLogLevelMap = jest.spyOn(
      config.settings.transportSentryConfig,
      'logLevelMap',
    );

    errorMessage = 'Jest Error Message';
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('IsDefined', () => {
    it('was loggerSentryTransport defined', async () => {
      expect(loggerSentryTransport).toBeDefined();
    });
  });

  /**
   * Test check if Sentry init was called
   */
  it('LoggerSentryTransport.init', async () => {
    expect(spyInit).toBeCalledTimes(1);
  });

  /**
   * Test check if Sentry init throw an error for a config undefined
   */
  it('LoggerSentryTransport.init_error', async () => {
    try {
      new LoggerSentryTransport(null);
    } catch (err) {
      expect(true).toBeTruthy();
    }
  });

  /**
   * Test Log level map with capture exception
   */
  it('LoggerSentryTransport.captureException', async () => {
    const logLevel = 'log' as LogLevel;
    const error = new Error();
    loggerSentryTransport.log(errorMessage, logLevel, error);

    expect(spyLogLevelMap).toBeCalledTimes(1);
    expect(spyCaptureException).toBeCalledTimes(1);
  });

  /**
   * Make sure call was made correctly
   *
   */
  it('LoggerSentryTransport.correctValues', async () => {
    const logLevel = 'log' as LogLevel;
    const error = new Error();
    loggerSentryTransport.log(errorMessage, logLevel, error);

    expect(spyLogLevelMap).toBeCalledTimes(1);
    expect(spyLogLevelMap).toHaveBeenCalledWith(logLevel);
    expect(spyCaptureException).toBeCalledTimes(1);
    expect(spyCaptureException).toHaveBeenCalledWith(error, {
      level: SentryLogSeverity.Error,
      extra: { developerMessage: errorMessage },
    });
  });

  /**
   * Test Log level map with capture exception with severity null
   */
  it('LoggerSentryTransport.captureException_severity_null', async () => {
    const logLevel = 'log' as LogLevel;
    const error = new Error();

    const spyLogLevelMap = jest
      .spyOn(config.settings.transportSentryConfig, 'logLevelMap')
      .mockReturnValue(null);

    loggerSentryTransport.log(errorMessage, logLevel, error);

    expect(spyLogLevelMap).toBeCalledTimes(1);
    expect(spyLogLevelMap).toHaveBeenCalledWith(logLevel);

    expect(spyCaptureException).toBeCalledTimes(1);
    expect(spyCaptureException).toHaveBeenCalledWith(error, {
      level: null,
      extra: { developerMessage: errorMessage },
    });
  });

  /**
   * Test Log level map with capture message
   */
  it('LoggerSentryTransport.captureMessage', async () => {
    const logLevel = 'log' as LogLevel;

    loggerSentryTransport.log(errorMessage, logLevel);

    expect(spyLogLevelMap).toBeCalledTimes(1);
    expect(spyCaptureException).toBeCalledTimes(0);
    expect(spyCaptureMessage).toBeCalledTimes(1);
  });

  /**
   * Test Log level map with capture message with severity null
   */
  it('LoggerSentryTransport.captureMessage_severity_null', async () => {
    const logLevel = 'log' as LogLevel;

    const spyLogLevelMap = jest
      .spyOn(config.settings.transportSentryConfig, 'logLevelMap')
      .mockReturnValue(null);

    loggerSentryTransport.log(errorMessage, logLevel);

    expect(spyLogLevelMap).toBeCalledTimes(1);
    expect(spyLogLevelMap).toHaveBeenCalledWith(logLevel);

    expect(spyCaptureMessage).toBeCalledTimes(1);
    expect(spyCaptureMessage).toHaveBeenCalledWith(errorMessage, null);
  });
});