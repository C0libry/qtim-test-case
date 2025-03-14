import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';

// import { ValidatedUser } from '../interfaces/validatedUser.interface';
import { ValidatedUser } from '../interfaces/validatedUser.interface';

export interface RequestWithUser extends Request {
  user: ValidatedUser;
}

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): ValidatedUser => {
  const request = context.switchToHttp().getRequest() as RequestWithUser;
  return request.user as ValidatedUser;
});
