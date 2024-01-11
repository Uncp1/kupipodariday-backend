import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  //constructor() {}
  // async canActivate(context: ExecutionContext): Promise<boolean> {}
}
