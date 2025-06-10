import { Controller, Get } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('/health-check')
  async healthCheck(): Promise<string> {
    return await this.systemService.healthCheck();
  }
}
