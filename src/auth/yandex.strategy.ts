import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/users.service';

export default class YandexStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({ scope: ['login:email', 'login:info'] });
  }
  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = await this.usersService.findById(profile); //placeholder
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
