import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): { message: string } {
    return { message: 'server Ok' };
  }
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
