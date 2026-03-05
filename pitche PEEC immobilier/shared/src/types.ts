export enum UserRole {
  CLIENT = 'client',
  AGENCY = 'agency',
  ADMIN = 'admin'
}

export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  VILLA = 'villa',
  LAND = 'land',
  COMMERCIAL = 'commercial'
}

export enum TransactionType {
  SALE = 'sale',
  RENT = 'rent'
}

export enum PropertyStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  SOLD = 'sold',
  RENTED = 'rented'
}

export interface User {
  _id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  verified: boolean;
  createdAt: Date;
}

export interface Agency extends User {
  companyName: string;
  license: string;
  address: string;
  subscriptionPlan: 'basic' | 'premium';
}

export interface Property {
  _id: string;
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
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  features: string[];
  agencyId: string;
  status: PropertyStatus;
  verificationNotes?: string;
  views: number;
  sponsored: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Visit {
  _id: string;
  propertyId: string;
  clientId: string;
  agencyId: string;
  scheduledDate: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}
