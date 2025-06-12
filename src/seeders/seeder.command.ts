import { Injectable, Logger } from '@nestjs/common';
import { Command } from 'nestjs-command';
import coins from './mockups/mockup.coins';
import users from './mockups/mockup.users';
import { CoinsService } from 'src/modules/coins/coins.service';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class SeederCommand {
  private readonly logger: Logger;

  constructor(
    private readonly coinsService: CoinsService,
    private readonly usersService: UsersService,
  ) {
    this.logger = new Logger(SeederCommand.name);
  }

  @Command({ command: 'seed', describe: 'Seed data' })
  async seedUsers() {
    try {
      this.logger.log('start seeding');

      await this.usersService.seederRemove();
      await this.usersService.seederInsert(users);
      await this.coinsService.seederRemove();
      await this.coinsService.seederInsert(coins);

      this.logger.log('data seeded');
    } catch (error: unknown) {
      if (error instanceof Error)
        this.logger.error(error.stack ? error.stack : error.message);
      else this.logger.error(`Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
