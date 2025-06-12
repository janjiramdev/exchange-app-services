import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCoinDto } from './dtos/create-coin.dto';
import { Coin, CoinDocument } from 'src/schemas/coin.schema';

@Injectable()
export class CoinsService {
  private readonly logger = new Logger();

  constructor(@InjectModel(Coin.name) private readonly coinModel: Model<Coin>) {
    this.logger = new Logger(CoinsService.name);
  }

  async createOne(input: CreateCoinDto): Promise<CoinDocument> {
    const { name } = input;

    try {
      const coin = await this.coinModel
        .findOne({
          name,
          deletedAt: null,
        })
        .exec();
      if (coin)
        throw new BadRequestException(`coin with name: ${name} already exits`);

      return await this.coinModel.create({
        ...input,
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

  async findOneById(input: string): Promise<CoinDocument | null | undefined> {
    return await this.coinModel.findOne({ _id: input, deletedAt: null }).exec();
  }

  async seederRemove(): Promise<void> {
    await this.coinModel.deleteMany();
  }

  async seederInsert(input: Coin[]): Promise<void> {
    await this.coinModel.create(input);
  }
}
