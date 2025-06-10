import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IInsertOneUserInput,
  IUpdateOneUserRefreshTokenInput,
} from 'src/interfaces/user.interface';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger: Logger;

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    this.logger = new Logger(UsersService.name);
  }

  async insertOne(input: IInsertOneUserInput): Promise<UserDocument> {
    return await this.userModel
      .create({
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })
      .then((result) => {
        const formattedResult = result.toObject() as Record<string, any>;
        delete formattedResult.password;
        return formattedResult as UserDocument;
      });
  }

  async findOneByUsername(
    input: string,
  ): Promise<UserDocument | null | undefined> {
    return await this.userModel
      .findOne({ username: input })
      .select(['+password', '+refreshToken']);
  }

  async findOneById(input: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({ _id: input });
      if (!user)
        throw new NotFoundException(`user with id: ${input} not found`);

      return user;
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
    const { _id, refreshToken } = input;
    await this.userModel.findOneAndUpdate(
      { _id },
      { refreshToken, updatedAt: new Date() },
    );
  }
}
