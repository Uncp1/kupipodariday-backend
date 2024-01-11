import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from 'src/guards/local.guard';
import { UserRequest } from 'src/utils/types';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return this.authService.auth(user);
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req: UserRequest) {
    return this.authService.auth(req.user);
  }
}
