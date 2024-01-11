import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  auth(user: User) {
    return {
      access_token: this.jwtService.sign(
        { sub: user.id },
        {
          expiresIn: '1d',
        },
      ),
    };
  }

  async validatePassword(username: string, receivedPassword: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      return null;
    }

    const isMatch = await this.hashService.verify(
      receivedPassword,
      user.password,
    );
    const { password, ...result } = user;

    return isMatch ? result : null;
  }
}
