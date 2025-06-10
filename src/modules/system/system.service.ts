import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SystemService {
  private readonly logger;

  constructor() {
    this.logger = new Logger(SystemService.name);
  }

  async healthCheck(): Promise<string> {
    try {
      // Mockup process duration
      await new Promise((resolve) => setTimeout(resolve, 250));

      return 'the system works correctly';
    } catch (error: unknown) {
      if (error instanceof Error)
        this.logger.error(error.stack ? error.stack : error.message);
      else this.logger.error(`Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
