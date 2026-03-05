import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '@peec/shared';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
  verified: boolean;
  companyName?: string;
  license?: string;
  address?: string;
  subscriptionPlan?: 'basic' | 'premium';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  verified: { type: Boolean, default: false },
  companyName: { type: String },
  license: { type: String },
  address: { type: String },
  subscriptionPlan: { type: String, enum: ['basic', 'premium'], default: 'basic' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
