import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ETransferType } from 'src/enums/transfers.enum';

export class CreateTransferDto {
  @IsNotEmpty()
  @IsEnum(ETransferType)
  type: ETransferType;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  @IsString()
  senderPocketId: string;

  @IsOptional()
  @IsString()
  receiverPocketId?: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
