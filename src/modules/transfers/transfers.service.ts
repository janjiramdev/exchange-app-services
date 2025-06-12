import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransferDto } from './dtos/create-transfer.dto';
import { PocketsService } from '../pockets/pockets.service';
import { ETransferType } from 'src/enums/transfers.enum';
import { IUserInterface } from 'src/interfaces/user.interface';
import { Transfer, TransferDocument } from 'src/schemas/transfer.schema';

@Injectable()
export class TransfersService {
  private readonly logger = new Logger();

  constructor(
    @InjectModel(Transfer.name)
    private readonly transferModel: Model<Transfer>,
    private readonly pocketsService: PocketsService,
  ) {
    this.logger = new Logger(TransfersService.name);
  }

  async createTrasfer(
    input: CreateTransferDto,
    actionUser: IUserInterface,
  ): Promise<TransferDocument> {
    const { type, senderPocketId, receiverPocketId, amount, reference } = input;
    const { _id } = actionUser;

    try {
      if (type === ETransferType.EXTERNAL && !reference)
        throw new BadRequestException(
          'transfer type external reference not found',
        );
      if (type === ETransferType.INTERNAL && !receiverPocketId)
        throw new BadRequestException(
          'transfer type internal receiver pocket input not found',
        );

      const senderPocket =
        await this.pocketsService.findOneById(senderPocketId);
      if (!senderPocket)
        throw new BadRequestException(
          `pocket with id: ${senderPocketId} not found`,
        );
      if (String(senderPocket.user._id) !== _id)
        throw new ForbiddenException(
          `user with id:${_id} not belonged to pocket with id:${senderPocketId}`,
        );

      let receiverPocket;
      if (receiverPocketId) {
        receiverPocket =
          await this.pocketsService.findOneById(receiverPocketId);
        if (!receiverPocket)
          throw new BadRequestException(
            `pocket with id: ${receiverPocketId} not found`,
          );
      }

      await this.pocketsService.updatePocket(
        {
          pocketId: senderPocketId,
          amount: senderPocket.amount - amount,
        },
        actionUser,
      );
      if (receiverPocketId && receiverPocket)
        await this.pocketsService.updatePocket(
          {
            pocketId: receiverPocketId,
            amount: receiverPocket.amount + amount,
          },
          {
            _id: String(receiverPocket.user._id),
            username: receiverPocket.user.username,
          },
        );

      return await this.transferModel.create({
        type,
        amount,
        senderPocket: senderPocket._id,
        ...(receiverPocket && { receiverPocket: receiverPocket._id }),
        ...(reference && { reference }),
        createdAt: new Date(),
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        this.logger.error(error.stack ? error.stack : error.message);
      else this.logger.error(`Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
