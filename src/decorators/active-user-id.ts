import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from "@nestjs/common";

export const ActiveUserId = createParamDecorator<undefined>(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    return userId;
  }
);
