import mongoose, { Schema, Document } from 'mongoose';

export interface IVisit extends Document {
  propertyId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  agencyId: mongoose.Types.ObjectId;
  scheduledDate: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

const VisitSchema = new Schema<IVisit>({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  agencyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IVisit>('Visit', VisitSchema);
