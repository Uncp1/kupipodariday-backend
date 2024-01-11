import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super(
      'Пользователь с таким именем или почтой уже существует',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super('Пользователь не найден', HttpStatus.NOT_FOUND);
  }
}
