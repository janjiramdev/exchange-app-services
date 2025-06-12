import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SaleDocument } from './sale.schema';
import { UserDocument } from './user.schema';
import { EBalanceType, ECurrency } from 'src/enums/balance.enum';

@Schema({ collection: 'balance' })
export class Balance {
  @Prop({
    type: String,
    enum: EBalanceType,
    unique: false,
    required: true,
    nullable: false,
  })
  type: EBalanceType;

  @Prop({
    type: Number,
    unique: false,
    required: true,
    nullable: false,
    default: 0,
  })
  amount: number;

  @Prop({
    type: String,
    enum: ECurrency,
    unique: false,
    required: true,
    nullable: false,
  })
  currency: ECurrency;

  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: false,
    nullable: true,
    ref: 'Sales',
  })
  sale?: SaleDocument;

  // ----- ----- ----- Timestamp ----- ----- ----- //

  @Prop({
    type: Date,
    unique: false,
    required: true,
    nullable: false,
  })
  createdAt: Date;

  // ----- ----- ----- Action User ----- ----- ----- //

  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: true,
    nullable: false,
    ref: 'User',
  })
  createdBy: UserDocument;
}

export type BalanceDocument = HydratedDocument<Balance>;
export const BalanceSchema = SchemaFactory.createForClass(Balance);
