import express from 'express';
import Property from '../models/Property';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { UserRole, PropertyStatus } from '@peec/shared';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { city, type, transactionType, minPrice, maxPrice, minSurface, rooms } = req.query;
    
    const filter: any = { status: PropertyStatus.VERIFIED };
    
    if (city) filter.city = city;
    if (type) filter.type = type;
    if (transactionType) filter.transactionType = transactionType;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minSurface) filter.surface = { $gte: Number(minSurface) };
    if (rooms) filter.rooms = Number(rooms);

    const properties = await Property.find(filter)
      .populate('agencyId', 'name companyName phone email')
      .sort({ sponsored: -1, createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('agencyId', 'name companyName phone email');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.views += 1;
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticate, authorize(UserRole.AGENCY), async (req: AuthRequest, res) => {
  try {
    const property = new Property({
      ...req.body,
      agencyId: req.userId
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', authenticate, authorize(UserRole.AGENCY), async (req: AuthRequest, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, agencyId: req.userId });
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    Object.assign(property, req.body);
    property.updatedAt = new Date();
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authenticate, authorize(UserRole.AGENCY), async (req: AuthRequest, res) => {
  try {
    const property = await Property.findOneAndDelete({ _id: req.params.id, agencyId: req.userId });
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/verify', authenticate, authorize(UserRole.ADMIN), async (req, res) => {
  try {
    const { status, verificationNotes } = req.body;
    
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status, verificationNotes, updatedAt: new Date() },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
