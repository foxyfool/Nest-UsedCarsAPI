import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';

import { UsersService } from '../users.service';

// turning this into a middleware

@Injectable()
export class currentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {} // get acces to the UsersService

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);
      request.currentUser = user;
    }

    return handler.handle();
  }
}
