import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  constructor(private configService: ConfigService) {}

  async hash(password: string): Promise<string> {
    const saltRounds = parseInt(this.configService.get('SALT'), 10);
    return await bcrypt.hash(password, saltRounds);
  }

  async verify(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
