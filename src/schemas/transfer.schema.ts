import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PocketDocument } from './pocket.schema';
import { ETransferType } from 'src/enums/transfers.enum';

@Schema({ collection: 'transfers' })
export class Transfer {
  @Prop({
    type: String,
    enum: ETransferType,
    unique: false,
    required: true,
    nullable: false,
  })
  type: ETransferType;

  @Prop({
    type: Number,
    unique: false,
    required: true,
    nullable: false,
    default: 0,
  })
  amount: number;

  @Prop({ type: String, unique: false, required: false, nullable: true })
  reference?: string;

  // ----- ----- ----- Relations ----- ----- ----- //

  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: true,
    nullable: false,
    ref: 'Pocket',
  })
  senderPocket: PocketDocument;

  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: false,
    nullable: true,
    ref: 'Pocket',
  })
  receiverPocket?: PocketDocument;

  // ----- ----- ----- Timestamps ----- ----- ----- //

  @Prop({
    type: Date,
    unique: false,
    required: true,
    nullable: false,
  })
  createdAt: Date;
}

export type TransferDocument = HydratedDocument<Transfer>;
export const TransferSchema = SchemaFactory.createForClass(Transfer);
