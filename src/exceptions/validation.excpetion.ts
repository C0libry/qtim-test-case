import { HttpException, HttpStatus } from '@nestjs/common';

export interface Message {
  statusCode: number;
  field: string | string[];
  message: string;
  error: string;
}

export class ValidationException extends HttpException {
  messages: Message[] | undefined;

  constructor(response: string | Message[], key?: string | string[]) {
    if (typeof response == 'string') {
      super(
        {
          statusCode: 400,
          field: key ? key : 'none',
          message: response,
          error: 'Validation',
        },
        HttpStatus.BAD_REQUEST,
      );
      return;
    }
    const messages: Message[] = response.map((message) => {
      return <Message>{
        statusCode: 400,
        field: message?.field ? message.field : 'none',
        message: message.message,
        error: 'Validation',
      };
    });

    super(messages, HttpStatus.BAD_REQUEST);

    this.messages = response;
  }
}
