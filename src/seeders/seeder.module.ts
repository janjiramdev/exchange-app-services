import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { SeederCommand } from './seeder.command';
import { CoinsModule } from 'src/modules/coins/coins.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [CommandModule, CoinsModule, UsersModule],
  providers: [SeederCommand],
})
export class SeederModule {}
