import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BuySaleOfferDto } from './dtos/buy-sale-offer.dto';
import { CreateSaleDto } from './dtos/create-sale.dto';
import { UpdateSaleDto } from './dtos/update.sale.dto';
import { BalanceService } from '../balance/balance.service';
import { PocketsService } from '../pockets/pockets.service';
import { UsersService } from '../users/users.service';
import { EBalanceType, ECurrency } from 'src/enums/balance.enum';
import { ESalesStatus } from 'src/enums/sales.enum';
import { IUserInterface } from 'src/interfaces/user.interface';
import { Sale, SaleDocument } from 'src/schemas/sale.schema';

@Injectable()
export class SalesService {
  private readonly logger = new Logger();

  constructor(
    @InjectModel(Sale.name)
    private readonly saleModel: Model<SaleDocument>,
    @Inject(forwardRef(() => BalanceService))
    private readonly balanceService: BalanceService,
    private readonly configService: ConfigService,
    private readonly pocketsService: PocketsService,
    private readonly usersService: UsersService,
  ) {
    this.logger = new Logger(SalesService.name);
  }

  async createSale(
    input: CreateSaleDto,
    actionUser: IUserInterface,
  ): Promise<SaleDocument> {
    const {
      sellerPocketId,
      amount,
      priceUSD: inputPriceUSD,
      priceTHB: inputPriceTHB,
    } = input;
    const { _id, username } = actionUser;

    try {
      if (!inputPriceUSD && !inputPriceTHB)
        throw new BadRequestException('input price not found');
      else if (inputPriceUSD && inputPriceTHB)
        throw new BadRequestException('input price duplicate USD and THB');

      const exchangeRateUSDtoTHB =
        this.configService.get<number>('sales.exchangeRateUSDtoTHB') ?? 35;
      const exchangeRateTHBtoUSD =
        this.configService.get<number>('sales.exchangeRateTHBtoUSD') ?? 0.0285;
      let priceUSD = inputPriceUSD;
      let priceTHB = inputPriceTHB;
      if (priceUSD) priceTHB = Math.round(priceUSD * exchangeRateUSDtoTHB);
      else if (priceTHB) priceUSD = Math.round(priceTHB * exchangeRateTHBtoUSD);

      const pocket = await this.pocketsService.findOneById(sellerPocketId);
      if (!pocket)
        throw new NotFoundException(
          `pocket with id: ${sellerPocketId} not found`,
        );
      else if (pocket.user.username !== username)
        throw new ForbiddenException(
          `user with id:${_id} not belonged to pocket with id:${sellerPocketId}`,
        );
      if (amount > pocket.amount)
        throw new BadRequestException(
          `pocket current amount: ${pocket.amount}, is not enough`,
        );

      await this.pocketsService.updatePocket(
        {
          pocketId: sellerPocketId,
          amount: pocket.amount - amount,
        },
        actionUser,
      );

      return await this.saleModel.create({
        sellerPocket: new Types.ObjectId(sellerPocketId),
        amount,
        priceUSD,
        priceTHB,
        status: ESalesStatus.PENDING,
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

  async updateSale(
    input: UpdateSaleDto,
    actionUser: IUserInterface,
  ): Promise<SaleDocument> {
    const {
      saleId,
      amount,
      priceUSD: inputPriceUSD,
      priceTHB: inputPriceTHB,
    } = input;
    const { _id, username } = actionUser;

    try {
      if (!inputPriceUSD && !inputPriceTHB)
        throw new BadRequestException('input price not found');
      else if (inputPriceUSD && inputPriceTHB)
        throw new BadRequestException('input price duplicate USD and THB');

      const exchangeRateUSDtoTHB =
        this.configService.get<number>('sales.exchangeRateUSDtoTHB') ?? 35;
      const exchangeRateTHBtoUSD =
        this.configService.get<number>('sales.exchangeRateTHBtoUSD') ?? 0.0285;
      let priceUSD = inputPriceUSD;
      let priceTHB = inputPriceTHB;
      if (priceUSD) priceTHB = Math.round(priceUSD * exchangeRateUSDtoTHB);
      else if (priceTHB) priceUSD = Math.round(priceTHB * exchangeRateTHBtoUSD);

      const sale = await this.saleModel
        .findOne({ _id: saleId, deletedAt: null })
        .populate({
          path: 'sellerPocket',
          populate: {
            path: 'user',
          },
        });
      if (!sale)
        throw new NotFoundException(`sale with id: ${saleId} not found`);
      else if (sale.sellerPocket.user.username !== username)
        throw new ForbiddenException(
          `user with id:${_id} not belonged to sale with id:${saleId}`,
        );

      const actualAmount = sale.sellerPocket.amount + sale.amount;
      if (amount > actualAmount)
        throw new BadRequestException(
          `pocket current amount: ${actualAmount}, is not enough`,
        );

      await this.pocketsService.updatePocket(
        {
          pocketId: String(sale.sellerPocket._id),
          amount: actualAmount - amount,
        },
        actionUser,
      );

      return (await this.saleModel
        .findOneAndUpdate(
          { _id: new Types.ObjectId(saleId) },
          {
            amount,
            priceUSD,
            priceTHB,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec()) as SaleDocument;
    } catch (error: unknown) {
      if (error instanceof Error)
        this.logger.error(error.stack ? error.stack : error.message);
      else this.logger.error(`Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async findOneById(input: string): Promise<SaleDocument | null | undefined> {
    return await this.saleModel.findOne({ _id: input, deletedAt: null }).exec();
  }

  async buySaleOffer(
    input: BuySaleOfferDto,
    actionUser: IUserInterface,
  ): Promise<SaleDocument> {
    const { saleId, currency } = input;
    const { _id } = actionUser;

    try {
      const sale = await this.saleModel
        .findOne({ _id: saleId, deletedAt: null })
        .populate({
          path: 'sellerPocket',
          populate: {
            path: 'user',
          },
        })
        .exec();
      if (!sale)
        throw new NotFoundException(`sale with id ${saleId} not found`);
      if (sale.status !== ESalesStatus.PENDING)
        throw new BadRequestException(`sale with id: ${saleId} already sold`);
      if (String(sale.sellerPocket.user._id) === _id)
        throw new BadRequestException(`user cannot buy own sales`);

      const user = await this.usersService.findOneById(_id);
      let actualPrice;

      if (currency === ECurrency.USD) {
        if (sale.priceUSD > user.balanceUSD)
          throw new BadRequestException(
            `user amount: ${user?.balanceUSD}, is not enough`,
          );
        else actualPrice = sale.priceUSD;
      } else {
        if (sale.priceTHB > user.balanceTHB)
          throw new BadRequestException(
            `user amount: ${user?.balanceTHB}, is not enough`,
          );
        else actualPrice = sale.priceTHB;
      }

      let buyerPocket = await this.pocketsService.findOneByUserIdAndCoinId({
        userId: _id,
        coinId: String(sale.sellerPocket.coin._id),
      });
      if (!buyerPocket)
        buyerPocket = await this.pocketsService.createPocket(
          {
            coinId: String(sale.sellerPocket.coin._id),
            amount: sale.amount,
          },
          actionUser,
        );
      else {
        await this.pocketsService.updatePocket(
          {
            pocketId: String(buyerPocket._id),
            amount: buyerPocket.amount + sale.amount,
          },
          actionUser,
        );
      }

      const sellerBalance = await this.balanceService.createBalance(
        {
          type: EBalanceType.SOLD_COIN,
          amount: actualPrice,
          currency,
          saleId,
        },
        {
          _id: String(sale.sellerPocket.user._id),
          username: sale.sellerPocket.user.username,
        },
      );

      const buyerBalance = await this.balanceService.createBalance(
        {
          type: EBalanceType.BOUGHT_COIN,
          amount: actualPrice,
          currency,
          saleId,
        },
        actionUser,
      );

      return (await this.saleModel.findOneAndUpdate(
        { _id: saleId },
        {
          status: ESalesStatus.SOLD,
          buyerPocket: buyerPocket._id,
          sellerBalance: sellerBalance._id,
          buyerBalance: buyerBalance._id,
          updatedAt: new Date(),
        },
        { new: true },
      )) as SaleDocument;
    } catch (error: unknown) {
      if (error instanceof Error)
        this.logger.error(error.stack ? error.stack : error.message);
      else this.logger.error(`Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
