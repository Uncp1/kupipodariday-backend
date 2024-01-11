import { Injectable } from '@nestjs/common';
//mport { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10); //need a fix for ConfigService
  }

  async verify(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
