import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BalanceDocument } from './balance.schema';
import { PocketDocument } from './pocket.schema';
import { ESalesStatus } from 'src/enums/sales.enum';

@Schema({ collection: 'sales' })
export class Sale {
  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: true,
    nullable: false,
    ref: 'Pocket',
  })
  sellerPocket: PocketDocument;

  @Prop({
    type: Number,
    unique: false,
    required: true,
    nullable: false,
    default: 0,
  })
  amount: number;

  @Prop({
    type: Number,
    unique: false,
    required: true,
    nullable: false,
    default: 0,
  })
  priceUSD: number;

  @Prop({
    type: Number,
    unique: false,
    required: true,
    nullable: false,
    default: 0,
  })
  priceTHB: number;

  @Prop({
    type: String,
    enum: ESalesStatus,
    unique: false,
    required: true,
    nullable: false,
  })
  status: ESalesStatus;

  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: false,
    nullable: true,
    ref: 'Pocket',
  })
  buyerPocket?: PocketDocument;

  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: false,
    nullable: true,
    ref: 'Balance',
  })
  sellerBalance?: BalanceDocument;

  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: false,
    nullable: true,
    ref: 'Balance',
  })
  buyerBalance?: BalanceDocument;

  // ----- ----- ----- Timestamp ----- ----- ----- //

  @Prop({
    type: Date,
    unique: false,
    required: true,
    nullable: false,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    unique: false,
    required: true,
    nullable: false,
  })
  updatedAt: Date;

  @Prop({
    type: Date,
    unique: false,
    required: false,
    nullable: true,
  })
  deletedAt?: Date;
}

export type SaleDocument = HydratedDocument<Sale>;
export const SaleSchema = SchemaFactory.createForClass(Sale);
