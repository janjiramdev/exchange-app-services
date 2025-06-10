import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExternalUser } from 'src/databases/user';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): ExternalUser => {
    const request: Request & { user: ExternalUser } = context
      .switchToHttp()
      .getRequest();

    return {
      id: request?.user?.id,
      username: request?.user?.username,
    };
  },
);
