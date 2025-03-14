import { Injectable, LoggerService } from '@nestjs/common';
import { Logger } from 'tslog';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: Logger<CustomLoggerService>;
  constructor() {
    this.logger = new Logger<CustomLoggerService>({});
  }
  private getMessage(message: any, context?: string) {
    return context ? `[ ${context} ] ${message}` : message;
  }

  error(message: any, trace?: string, context?: string): any {
    this.logger.error(this.getMessage(message, context));
    if (trace) {
      this.logger.error(trace);
    }
  }

  log(message: any, context?: string): any {
    this.logger.info(this.getMessage(message, context));
  }

  warn(message: any, context?: string): any {
    this.logger.warn(this.getMessage(message, context));
  }
}
