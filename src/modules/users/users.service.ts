import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ExternalUser, mockUsers, User } from 'src/databases/user';
import {
  IInsertOneUserInput,
  IUpdateOneUserRefreshTokenInput,
} from 'src/interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly logger: Logger;

  // Mockup users data
  private users: User[] = [];

  constructor() {
    this.logger = new Logger(UsersService.name);
    this.users = mockUsers;
  }

  async insertOne(input: IInsertOneUserInput): Promise<User> {
    // Mockup process duration
    await new Promise((resolve) => setTimeout(resolve, 250));

    const { username, password } = input;

    const user = {
      id: String(this.users.length + 1),
      username,
      password,
    };
    this.users.push(user);

    return user;
  }

  async findOneByUsername(input: string): Promise<User | undefined> {
    // Mockup process duration
    await new Promise((resolve) => setTimeout(resolve, 250));

    return this.users.find((user) => user.username === input);
  }

  async findOneById(input: string): Promise<ExternalUser> {
    try {
      // Mockup process duration
      await new Promise((resolve) => setTimeout(resolve, 250));

      const user = this.users.find((user) => user.id === input);
      if (!user)
        throw new NotFoundException(`user with id: ${input} not found`);

      return plainToInstance(ExternalUser, user);
    } catch (error: unknown) {
      if (error instanceof Error)
        this.logger.error(error.stack ? error.stack : error.message);
      else this.logger.error(`Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async updateOneUserRefreshToken(
    input: IUpdateOneUserRefreshTokenInput,
  ): Promise<void> {
    // Mockup process duration
    await new Promise((resolve) => setTimeout(resolve, 250));

    const { id, refreshToken } = input;
    const findUserIndex = this.users.findIndex((user) => user.id === id);
    this.users[findUserIndex] = { ...this.users[findUserIndex], refreshToken };
  }
}
