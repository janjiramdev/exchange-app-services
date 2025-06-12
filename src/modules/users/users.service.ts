import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ICreateOneUserInput,
  IUpdateOneUserBalanceInput,
  IUpdateOneUserRefreshTokenInput,
} from 'src/interfaces/user.interface';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger: Logger;

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    this.logger = new Logger(UsersService.name);
  }

  async createOne(input: ICreateOneUserInput): Promise<UserDocument> {
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
      .findOne({ username: input, deletedAt: null })
      .select(['+password', '+refreshToken']);
  }

  async findOneById(input: string): Promise<UserDocument> {
    try {
      const user = await this.userModel
        .findOne({
          _id: input,
          deletedAt: null,
        })
        .exec();
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
    await this.userModel
      .findOneAndUpdate(
        { _id, deletedAt: null },
        { refreshToken, updatedAt: new Date() },
      )
      .exec();
  }

  async updateOneUserBalance(input: IUpdateOneUserBalanceInput): Promise<void> {
    const { _id, balanceUSD, balanceTHB } = input;
    await this.userModel
      .findOneAndUpdate(
        { _id, deletedAt: null },
        {
          ...(balanceUSD && { balanceUSD }),
          ...(balanceTHB && { balanceTHB }),
          updatedAt: new Date(),
        },
      )
      .exec();
  }

  async seederRemove(): Promise<void> {
    await this.userModel.deleteMany();
  }

  async seederInsert(input: User[]): Promise<void> {
    await this.userModel.create(input);
  }
}
