import mongoose, { Schema, Document } from 'mongoose';
import { PropertyType, TransactionType, PropertyStatus } from '@peec/shared';

export interface IProperty extends Document {
  title: string;
  description: string;
  type: PropertyType;
  transactionType: TransactionType;
  price: number;
  surface: number;
  rooms: number;
  bathrooms: number;
  address: string;
  city: string;
  coordinates: { lat: number; lng: number };
  images: string[];
  features: string[];
  agencyId: mongoose.Types.ObjectId;
  status: PropertyStatus;
  verificationNotes?: string;
  views: number;
  sponsored: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: Object.values(PropertyType), required: true },
  transactionType: { type: String, enum: Object.values(TransactionType), required: true },
  price: { type: Number, required: true },
  surface: { type: Number, required: true },
  rooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  images: [{ type: String }],
  features: [{ type: String }],
  agencyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: Object.values(PropertyStatus), default: PropertyStatus.PENDING },
  verificationNotes: { type: String },
  views: { type: Number, default: 0 },
  sponsored: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProperty>('Property', PropertySchema);
