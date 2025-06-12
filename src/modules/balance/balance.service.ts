import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBalanceDto } from './dtos/create-balance.dto';
import { SalesService } from '../sales/sales.service';
import { UsersService } from '../users/users.service';
import { EBalanceType, ECurrency } from 'src/enums/balance.enum';
import { IUserInterface } from 'src/interfaces/user.interface';
import { Balance, BalanceDocument } from 'src/schemas/balance.schema';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger();

  constructor(
    @InjectModel(Balance.name)
    private readonly balanceModel: Model<Balance>,
    @Inject(forwardRef(() => SalesService))
    private readonly salesService: SalesService,
    private readonly usersService: UsersService,
  ) {
    this.logger = new Logger(BalanceService.name);
  }

  async createBalance(
    input: CreateBalanceDto,
    actionUser: IUserInterface,
  ): Promise<BalanceDocument> {
    const { type, amount, currency, saleId } = input;
    const { _id } = actionUser;

    try {
      if (saleId) {
        const sale = await this.salesService.findOneById(saleId);
        if (!sale)
          throw new NotFoundException(`sale with id ${saleId} not found`);
      }

      const user = await this.usersService.findOneById(_id);
      let actualBalanceUSD = user.balanceUSD;
      let actualBalanceTHB = user.balanceTHB;

      if ([EBalanceType.WITHDRAW, EBalanceType.BOUGHT_COIN].includes(type)) {
        if (currency === ECurrency.USD) {
          if (amount > user.balanceUSD)
            throw new BadRequestException(
              `user amount: ${user?.balanceUSD}, is not enough`,
            );
          else actualBalanceUSD -= amount;
        } else {
          if (amount > user.balanceTHB)
            throw new BadRequestException(
              `user amount: ${user?.balanceTHB}, is not enough`,
            );
          else actualBalanceTHB -= amount;
        }
      } else {
        if (currency === ECurrency.USD) actualBalanceUSD += amount;
        else actualBalanceTHB += amount;
      }

      await this.usersService.updateOneUserBalance({
        _id,
        balanceUSD: actualBalanceUSD,
        balanceTHB: actualBalanceTHB,
      });

      return await this.balanceModel.create({
        type,
        amount,
        currency,
        ...(saleId && { sale: new Types.ObjectId(saleId) }),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        createdBy: new Types.ObjectId(_id),
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        this.logger.error(error.stack ? error.stack : error.message);
      else this.logger.error(`Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
