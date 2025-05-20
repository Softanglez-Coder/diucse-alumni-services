import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  sayHello(): string {
    return `
        Hello, from CSE DIU Alumni APIs. 
        Please visit our website: https://csediualumni.com to know more. 
        If you are technical guy and looking for good stuff, 
        please explore API documentation at https://csediualumni.com/api-docs
      `;
  }

  @Public()
  @Get('health')
  checkHealth(): string {
    return `Hey! I am alive.`;
  }
}
