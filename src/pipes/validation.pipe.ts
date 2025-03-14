import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Message, ValidationException } from '../exceptions/validation.excpetion';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToInstance(<any>metadata.metatype, value, { enableImplicitConversion: true });
    let errors;
    if (value === null) {
      errors = [];
    } else {
      errors = await validate(obj, {
        whitelist: true,
        forbidUnknownValues: false,
        skipUndefinedProperties: true,
      });
    }
    if (errors.length) {
      const messages: Message[] = errors.map((error) => {
        return <Message>{
          field: error.property,
          message: Object.values(<any>error.constraints).join(', '),
        };
      });
      throw new ValidationException(messages);
    }
    return value;
  }
}
