import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePocketDto } from './dtos/create-pocket.dto';
import { CoinsService } from '../coins/coins.service';
import { IUserInterface } from 'src/interfaces/user.interface';
import { Pocket, PocketDocument } from 'src/schemas/pocket.schema';
import { UpdatePocketDto } from './dtos/update-pocket.dto';

@Injectable()
export class PocketsService {
  private readonly logger = new Logger();

  constructor(
    @InjectModel(Pocket.name)
    private readonly pocketModel: Model<PocketDocument>,
    private readonly coinsService: CoinsService,
  ) {
    this.logger = new Logger(PocketsService.name);
  }

  async createPocket(
    input: CreatePocketDto,
    actionUser: IUserInterface,
  ): Promise<PocketDocument> {
    const { coinId, amount } = input;
    const { _id } = actionUser;

    try {
      const coin = await this.coinsService.findOneById(coinId);
      if (!coin)
        throw new NotFoundException(`coin with id: ${coinId} not found`);

      const existingPocket = await this.pocketModel
        .findOne({
          user: new Types.ObjectId(_id),
          coin: new Types.ObjectId(coinId),
          deletedAt: null,
        })
        .exec();
      if (existingPocket)
        throw new BadRequestException(
          `user pocket of coin with id:${coinId} already exists in the system`,
        );

      return await this.pocketModel.create({
        user: new Types.ObjectId(_id),
        coin: new Types.ObjectId(coinId),
        amount: amount,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        this.logger.error(error.stack ? error.stack : error.message);
      else this.logger.error(`Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async updatePocket(
    input: UpdatePocketDto,
    actionUser: IUserInterface,
  ): Promise<PocketDocument> {
    const { pocketId, amount } = input;
    const { _id, username } = actionUser;

    try {
      const pocket = await this.pocketModel
        .findOne({
          _id: pocketId,
          deletedAt: null,
        })
        .populate('user')
        .exec();
      if (!pocket)
        throw new BadRequestException(`pocket with id:${pocketId} not found`);
      else if (pocket.user.username !== username)
        throw new ForbiddenException(
          `user with id:${_id} not belonged to pocket with id:${pocketId}`,
        );

      return (await this.pocketModel
        .findOneAndUpdate(
          { _id: new Types.ObjectId(pocketId) },
          { amount, updatedAt: new Date() },
          { new: true },
        )
        .exec()) as PocketDocument;
    } catch (error: unknown) {
      if (error instanceof Error)
        this.logger.error(error.stack ? error.stack : error.message);
      else this.logger.error(`Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
